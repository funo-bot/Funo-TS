import { Message, User } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { RichEmbed } from '../utils'

import * as commands from '.'

export const Help = new (class extends Command {

  public name = 'help'
  public category = Category.Utilities
  public description = 'View available commands'
  public aliases = ['h', '?', 'commands', 'cmds']

  public showInHelp = false

  public async run(funo: Funo, msg: Message, args: string[]) {
    const prefix = await funo.db.getPrefix(msg.guild.id)

    msg.channel.send(RichEmbed('Commands', 'Available commands',
      Object.values(commands).filter(cmd => cmd.showInHelp).map(cmd => ([`${prefix}${cmd.name}`, cmd.description, false])), 
      funo.user.avatarURL))
  }

})()
