import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Error } from '../utils'

export const Play = new (class implements Command {

  public name = 'play'
  public category = Category.Music
  public description = 'Play music'
  public aliases = ['p', 'add']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[]) {
    if (!msg.member.voiceChannel) {
      return msg.channel.send(Error('You must be in a voice channel to use this command'))
    }
  }

})()
