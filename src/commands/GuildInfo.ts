import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { RichEmbed } from '../utils'

export const GuildInfo = new (class extends Command {

  public name = 'guildinfo'
  public category = Category.Moderation
  public description = 'View information about this guild/server'
  public aliases = ['gi', 'ginfo', 'si', 'sinfo', 'serverinfo']

  public async run(funo: Funo, msg: Message, args: string[]) {
    msg.channel.send(RichEmbed('Guild Info', 'Information about this guild/server', [
      ['Name', msg.guild.name],
      ['ID', msg.guild.id],
      ['Owner', `<@${msg.guild.ownerID}>`],
      ['Current Prefix', `\`${await funo.db.getPrefix(msg.guild.id)}\``],
      ['Verified', msg.guild.verified ? 'Yes' : 'No'],
      ['Region', msg.guild.region],
      ['Users', msg.guild.members.filter(m => !m.user.bot).size],
      ['Bots', msg.guild.members.filter(m => m.user.bot).size],
      ['Emojis', msg.guild.emojis.size],
      ['Categories', msg.guild.channels.filter(c => c.type === 'category').size],
      ['Text Channels', msg.guild.channels.filter(c => c.type === 'text').size],
      ['Voice Channels', msg.guild.channels.filter(c => c.type === 'voice').size],
    ], msg.guild.iconURL))
  }

})()
