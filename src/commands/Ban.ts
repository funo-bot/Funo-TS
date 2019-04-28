import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { RichEmbed } from '../utils'

export const Ban = new (class implements Command {

  public name = 'ban'
  public category = Category.Moderation
  public description = 'View or change your prefix'
  public aliases = []
  public permissions = ['BAN_MEMBERS']

  public async run(funo: Funo, msg: Message, args: string[]) {
    const member = msg.guild.member(msg.mentions.users.first() || args[0])

    if(!member) return msg.channel.send(RichEmbed('You must provide a user to ban'))

    if(msg.author.id === member.id) return msg.channel.send(RichEmbed('You cannot ban yourself'))

    if(msg.author.id !== msg.guild.ownerID) {
      if(member.highestRole.position > msg.member.highestRole.position) {
        return msg.channel.send(RichEmbed('You cannot ban a users who has a higher role than you'))
      }

      if(member.highestRole.position === msg.member.highestRole.position) {
        return msg.channel.send(RichEmbed('You cannot ban this user as their highest role is the same as yours'))
      }
    }

    if(msg.guild.member(funo.user).highestRole.position <= member.highestRole.position) {
      return msg.channel.send(RichEmbed('Funo cannot ban this user'))
    }

    const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason given.'

    await member.send(RichEmbed(`You have been banned from \`${msg.guild.name}\``, null, [
      ['By:', `<@${msg.author.id}>`, false],
      ['Reason:', `\`\`\`${reason}\`\`\``, false],
    ], null, 'RED'))

    await member.ban()

    return msg.channel.send(RichEmbed(`<@${member.id}> has been banned from this server`))
  }

})()
