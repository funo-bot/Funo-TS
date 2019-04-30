import { Client, Message } from 'discord.js'

import { Command } from './Command'
import * as cmdList from './commands'
import { Config } from './interfaces/Config'
import { DB, Logger } from './utils'

export class Funo extends Client {

  public db: DB

  private logger: Logger = new Logger('Core')

  private commands: {
    [k: string]: Command,
  } = {}

  constructor(token: string, private config: Config) {
    super()

    this.db = new DB(config.db.url, config.db.user, config.db.password, config.db.name)

    this.on('message', msg => this.onMessageReceived(msg))

    this.doLogin(token)
  }

  private async doLogin(token: string) {
    await this.db.init()
    await this.loadCommands()

    await this.login(token)

    this.logger.info('Logged in as ' + this.user.username)
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

    this.logger.debug(`Received '${msg.content}'`)

    const prefix = await this.db.getPrefix(msg.guild.id)
    if (
      msg.content &&
      msg.content.startsWith(prefix) &&
      msg.content.trim() !== prefix
    ) {
      const content = msg.content.replace(prefix, '').trim().toLowerCase()
      const contentParts = content.split(/\s/gm)
      const cmdStr = contentParts[0]
      const args = contentParts.slice(1)

      if (!this.commands[cmdStr]) return

      const cmd = this.commands[cmdStr]
      await cmd.run(this, msg, args).catch(err => {
        //
      })
    }
  }

}
