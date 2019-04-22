import { Client, Message } from 'discord.js'

import { Logger } from '@/utils'

export class Funo extends Client {

  private logger: Logger = new Logger('Core')

  constructor(token: string) {
    super()

    this.on('message', msg => this.onMessageReceived(msg))

    this.login(token).then(() => this.onLoggedIn())
  }

  private onLoggedIn() {
    this.logger.info('Logged in as ' + this.user.username)
  }

  private onMessageReceived(msg: Message){
    this.logger.debug('Got ' + msg)
  }

}