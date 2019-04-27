import { Client, Message } from 'discord.js'

import { Logger } from '@/utils'
import { Config } from './interfaces/Config'
import { DB } from './utils/DB'

export class Funo extends Client {

  private logger: Logger = new Logger('Core')
  private db: DB

  constructor(token: string, private config: Config) {
    super()

    this.db = new DB(config.db.url, config.db.user, config.db.password, config.db.name)

    this.on('message', msg => this.onMessageReceived(msg))

    this.doLogin(token)
  }

  private async doLogin(token: string) {
    await this.db.init()

    await this.login(token)

    this.logger.info('Logged in as ' + this.user.username)
  }

  private onMessageReceived(msg: Message) {
    this.logger.debug(`Received '${msg.content}'`)
  }

}
