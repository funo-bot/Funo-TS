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
  private realPlayer: Player | null = null

  constructor(private guild: GuildClass, private funo: Funo) { }

  public async initPlayer(channelId: string) {
    if(this.realPlayer) return this.realPlayer

    return this.realPlayer = await this.funo.playerManager.join({
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
      this.realPlayer.disconnect()
      this.realPlayer.destroy()
      this.funo.playerManager.leave(this.guild.id)
    }

    this.realPlayer = player
    if (!player) return

    player.on('end', () => {
      this.queue.shift()

      if (this.queue.length) {
        player.play(this.queue[0].track)

        if (this.queueChannel) this.queueChannel.send(Track('Now Playing', this.queue[0]))
      } else if (this.queueChannel) {
        this.queueChannel.send(RichEmbed('End of queue, leaving channel'))
        this.player = null
        this.queueChannel = null
      }
    })
  }

  public skipSong() {
    if (!this.realPlayer) return null

    this.realPlayer.stop()

    if (this.queue.length <= 1) return null

    return this.queue[1]
  }

  public removeSong(num: number) {
    const track = this.queue[num - 1]
    this.queue.splice(num - 1)

    return track
  }

}
