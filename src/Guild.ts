import { Guild as GuildClass, TextChannel } from 'discord.js'
import { Player } from 'discord.js-lavalink'
import ytsr from 'ytsr'

import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import { Funo } from './Funo'
import { RichEmbed, Track } from './utils'

export interface GuildTrackBase {
  title: string,
  author: {
    name: string,
    link: string,
    verified: boolean,
  },
  link: string,
  thumb: string | null,
  duration: string,
}

export interface GuildUser {
  id: string,
  tag: string,
}

export interface GuildTrack extends GuildTrackBase {
  track: string,
  addedBy: {
    id: string,
    tag: string,
  },
}

export class Guild {

  public queue: GuildTrack[] = []
  public queueChannel: TextChannel | null = null
  public loop: 'off' | 'queue' | 'track' = 'off'
  private track: number = -1
  private realPlayer: Player | null = null

  constructor(public guild: GuildClass, private funo: Funo) { }

  public async initPlayer(channelId: string) {
    if(this.realPlayer) return this.realPlayer

    return this.player = await this.funo.playerManager.join({
      guild: this.guild.id,
      channel: channelId,
      host: this.funo.playerManager.nodes.first().host,
    })
  }

  public get id() { return this.guild.id }

  public get player() {
    return this.realPlayer
  }

  public set player(player: Player | null) {
    if(this.realPlayer) {
      this.realPlayer.stop()
      this.realPlayer.disconnect()
      this.realPlayer.destroy()
      this.funo.playerManager.leave(this.guild.id)
    }

    this.realPlayer = player
    if (!player) return

    player.on('end', () => {
      if (this.track > -1 && this.queue[this.track + 1]) {
        const trackIndex = ++this.track
        this.play(trackIndex + 1)
      } else if(this.loop === 'track') {
        this.play(this.track + 1)
      } else if(this.loop === 'queue') {
        this.play(1)
      } else {
        if (this.queueChannel) this.queueChannel.send(RichEmbed('End of queue, leaving channel'))
        this.player = null
        this.queueChannel = null
      }
    })
  }

  public enqueue(track: GuildTrack) {
    const index = this.queue.push(track)

    this.funo.emit(`funo:queued`, {
      guild: this.guild.id,
      track: {
        ...track,
        addedBy: track.addedBy.id,
      },
      trackNo: index - 1,
    })

    return index
  }

  public play(track: number) {
    if(!this.player) return

    this.track = track - 1
    this.player.play(this.queue[this.track].track)

    const currentTrack = this.queue[this.track]
    if (this.queueChannel) this.queueChannel.send(Track('Now Playing', currentTrack))

    this.funo.emit(`funo:playing`, {
      guild: this.guild.id,
      track: {
        ...currentTrack,
        addedBy: currentTrack.addedBy.id,
      },
      trackNo: this.track,
    })
  }

  public get currentTrack() {
    if(this.track < 0 || !this.queue[this.track]) return null

    return this.queue[this.track]
  }

  public skipSong() {
    if (!this.realPlayer) return null

    const track = this.queue[this.track + 1] || null

    this.realPlayer.stop()

    return track
  }

  public removeSong(num: number) {
    const track = this.queue[num - 1]
    this.queue.splice(num - 1, 1)

    return track
  }

  public clearQueue() {
    if(!this.realPlayer) return

    this.queue = []
    this.player = null
  }

  public async ytSearch(query: string, addedBy: GuildUser): Promise<GuildTrack | null> {
    return new Promise(resolve => {
      ytsr(query, {
        limit: 5,
      }, async (err: any, result: any) => {
        if(!result.items || !result.items[0]) return resolve(null)

        const { title, link, thumbnail, duration, author: { name, ref, verified } } = result.items[0]

        resolve(await this.getTrack({
          title,
          link,
          author: {
            name,
            link: ref,
            verified,
          },
          duration,
          thumb: thumbnail,
        }, addedBy))
      })
    })
  }

  public async getTrack(base: GuildTrackBase, addedBy: GuildUser): Promise<GuildTrack | null> {
    return new Promise((resolve, reject) => {
      const node = this.funo.playerManager.nodes.first()

      const params = new URLSearchParams()
      params.append('identifier', `ytsearch: ${base.link}`)

      fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, {
        headers: {
          Authorization: node.password || '',
        },
      }).then(res => res.json())
        .then(({ tracks: [{ track }] }) => {
          resolve({
            ...base,
            track,
            addedBy,
          })
        })
        .catch(err => {
          resolve(null)
        })
    })
  }

  public duration(ms: number) {
    const seconds = Math.floor((ms / 1000) % 60),
      minutes = Math.floor((ms / (1000 * 60)) % 60),
      hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

    const m = (minutes < 10) ? '0' + minutes : minutes
    const s = (seconds < 10) ? '0' + seconds : seconds

    return m + ':' + s
  }

}
