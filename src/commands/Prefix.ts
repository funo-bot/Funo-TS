import { Message, RichEmbed } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'

export const Prefix = new (class implements Command {

  public name = 'prefix'
  public category = Category.Moderation
  public description = 'View or change your prefix'
  public aliases = []

  public async run(funo: Funo, msg: Message, args: string[]) {
    const prefix = await funo.db.getPrefix(msg.guild.id)

    if (!args.length) {
      return msg.channel.send(new RichEmbed()
        .setDescription(`This server's current prefix is \`${prefix}\``)
        .setColor('BLUE'),
      )
    }

    if (!msg.member.hasPermission('MANAGE_GUILD')) {
      return msg.channel.send(new RichEmbed()
        .setDescription('You lack the `MANAGE_GUILD` permisson')
        .setColor('RED'),
      )
    }

    await funo.db.setPrefix(msg.guild.id, args[0])

    msg.channel.send(new RichEmbed()
      .setDescription(`Server prefix is now \`${await funo.db.getPrefix(msg.guild.id)}\``)
      .setColor('BLUE'),
    )
  }

})()
