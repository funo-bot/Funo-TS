import { Guild as GuildClass } from 'discord.js'
import { Player } from 'discord.js-lavalink'

export interface GuildTrack {
  link: string,
  thumb: string | null,
  track: string,
  title: string,
  author: string,
  length: number,
}

export class Guild {

  public queue: GuildTrack[] = []
  private realPlayer: Player | null = null

  constructor(private guild: GuildClass) {}

  public get player() {
    return this.realPlayer
  }

  public set player(val: Player | null) {
    this.realPlayer = val
  }

}
