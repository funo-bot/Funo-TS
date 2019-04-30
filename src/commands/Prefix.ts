import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Error, RichEmbed } from '../utils'

export const Prefix = new (class implements Command {

  public name = 'prefix'
  public category = Category.Moderation
  public description = 'View or change your prefix'
  public aliases = []

  public async run(funo: Funo, msg: Message, args: string[]) {
    const prefix = await funo.db.getPrefix(msg.guild.id)

    if (!args.length) {
      return msg.channel.send(RichEmbed(`This server's current prefix is \`${prefix}\``))
    }

    if (!msg.member.hasPermission('MANAGE_GUILD')) {
      return msg.channel.send(Error('You lack the `MANAGE_GUILD` permisson'))
    }

    await funo.db.setPrefix(msg.guild.id, args[0])

    msg.channel.send(RichEmbed(`Server prefix is now \`${await funo.db.getPrefix(msg.guild.id)}\``))
  }

})()
