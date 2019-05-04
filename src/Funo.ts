import { Client, Message } from 'discord.js'
import { PlayerManager } from 'discord.js-lavalink'

import { Command } from './Command'
import * as cmdList from './commands'
import { Guild } from './Guild'
import { Config } from './interfaces/Config'
import { DB, Logger } from './utils'

export class Funo extends Client {

  public db: DB
  public playerManager!: PlayerManager

  private logger: Logger = new Logger('Core')

  private commands: {
    [k: string]: Command,
  } = {}

  private guildInstances: {
    [k: string]: Guild,
  } = {}

  private initd: boolean = false

  constructor(private loginToken: string, public config: Config) {
    super()

    this.db = new DB(config.db.url, config.db.user, config.db.password, config.db.name)

    this.on('message', msg => this.onMessageReceived(msg))
  }

  public async init() {
    if(this.initd) return
    this.initd = true

    await this.db.init()

    await this.login(this.loginToken)

    this.playerManager = new PlayerManager(this, [
      { host: this.config.music.lavalinkHost, port: this.config.music.lavalinkPort, password: 'pass' },
    ], {
      user: this.user.id,
      shards: 0,
    })

    for await(const [sf, guild] of this.guilds) {
      this.guildInstances[guild.id] = new Guild(guild, this)
    }

    this.logger.info('Logged in as ' + this.user.username)

    await this.loadCommands()
  }

  public getGuild(id: string) {
    return this.guildInstances[id] || null
  }

  private async loadCommands() {
    const cmds = (cmdList as {
      [k: string]: Command,
    })
    for await (const command of Object.keys(cmds)) {
      const cmd = cmds[command]
      this.commands[cmd.name.toLowerCase()] = cmd

      if (cmd.aliases) {
        for await (const alias of cmd.aliases) {
          this.commands[alias] = cmd
        }
      }
    }
  }

  private async onMessageReceived(msg: Message) {
    if (!msg.guild) return

    const prefix = await this.db.getPrefix(msg.guild.id)
    if (
      msg.content &&
      (
        (msg.content.startsWith(prefix) && msg.content.trim() !== prefix) ||
        (msg.content.startsWith(`<@!${this.user.id}>`) && msg.content.trim() !== `<@!${this.user.id}>`) ||
        (msg.content.startsWith(`<@${this.user.id}>`) && msg.content.trim() !== `<@${this.user.id}>`)
      )
    ) {
      const content = msg.content
        .replace(new RegExp(`^(${prefix})`, 'gim'), '')
        .replace(new RegExp(`^(<@!?${this.user.id}>)`, 'gim'), '')
        .trim()
        .toLowerCase()
      const contentParts = content.split(/\s/gm)
      const cmdStr = contentParts[0]
      const args = contentParts.slice(1)

      if (!this.commands[cmdStr]) return

      let guild: Guild
      if(this.guildInstances[msg.guild.id]) {
        guild = this.guildInstances[msg.guild.id]
      } else {
        guild = new Guild(msg.guild, this)
        this.guildInstances[msg.guild.id] = guild
      }

      const cmd = this.commands[cmdStr]
      await cmd.run(this, msg, args, guild).catch(err => {
        //
      })
    }
  }

}
