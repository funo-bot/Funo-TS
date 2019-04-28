import { Message, RichEmbed } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'

export const GuildInfo = new (class implements Command {

  public name = 'guildinfo'
  public category = Category.Moderation
  public description = 'View information about this guild/server'
  public aliases = ['gi', 'ginfo', 'si', 'sinfo', 'serverinfo']

  public async run(funo: Funo, msg: Message, args: string[]) {
    msg.channel.send(new RichEmbed()
      .setTitle('Guild Info')
      .setDescription('Information about this guild/server')
      .addField('Name', msg.guild.name, true)
      .addField('ID', msg.guild.id, true)
      .addField('Owner', `<@${msg.guild.ownerID}>`, true)
      .addField('Current Prefix', `\`${await funo.db.getPrefix(msg.guild.id)}\``, true)
      .addField('User Count', msg.guild.members.filter(m => !m.client.user.bot).size, true)
      .addField('Bot Count', msg.guild.members.filter(m => m.client.user.bot).size, true)
      .setColor('BLUE'),
    )
  }

})()
