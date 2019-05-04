import { Guild as GuildClass, TextChannel, User } from 'discord.js'
import { Player } from 'discord.js-lavalink'
import { Funo } from './Funo'
import { RichEmbed, Track } from './utils'

export interface GuildTrack {
  link: string,
  thumb: string | null,
  track: string,
  title: string,
  author: string,
  length: number,
  duration: string,
  addedBy: User,
}

export class Guild {

  public queue: GuildTrack[] = []
  public queueChannel: TextChannel | null = null
  public loop: 'off' | 'queue' | 'track' = 'off'
  private track: number = -1
  private realPlayer: Player | null = null

  constructor(private guild: GuildClass, private funo: Funo) { }

  public async initPlayer(channelId: string) {
    if(this.realPlayer) return this.realPlayer

    return this.player = await this.funo.playerManager.join({
      guild: this.guild.id,
      channel: channelId,
      host: this.funo.playerManager.nodes.first().host,
    })
  }

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
      this.queue.shift()

      if (this.track > -1 && this.queue[this.track + 1]) {
        player.play(this.queue[++this.track].track)

        if (this.queueChannel) this.queueChannel.send(Track('Now Playing', this.queue[this.track]))
      } else if(this.loop === 'track') {
        player.play(this.queue[this.track].track)
      } else if(this.loop === 'queue') {
        this.track = 0
        player.play(this.queue[this.track].track)

        if (this.queueChannel) this.queueChannel.send(Track('Now Playing', this.queue[this.track]))
      } else {
        if (this.queueChannel) this.queueChannel.send(RichEmbed('End of queue, leaving channel'))
        this.player = null
        this.queueChannel = null
      }
    })
  }

  public enqueue(track: GuildTrack) {
    return this.queue.push(track)
  }

  public play(track: number) {
    if(!this.player) return

    this.track = track - 1
    this.player.play(this.queue[this.track].track)
  }

  public get currentTrack() {
    if(!this.track || !this.queue[this.track]) return null

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
    this.queue.splice(num - 1)

    return track
  }

  public clearQueue() {
    if(!this.realPlayer) return

    this.queue = []
    this.player = null
  }

}
