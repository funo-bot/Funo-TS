import { Client } from 'discord.js'

import { Logger } from '@/utils'

export class Funo extends Client {

  private logger: Logger = new Logger('Core')

  constructor(token: string) {
    super()

    this.login(token).then(() => this.onLoggedIn())
  }

  private onLoggedIn() {
    this.logger.info('Logged in')
  }

}