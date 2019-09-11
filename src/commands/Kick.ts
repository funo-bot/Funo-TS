import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Error, RichEmbed } from '../utils'

export const Kick = new (class extends Command {

  public name = 'kick'
  public category = Category.Moderation
  public description = 'Kick members from your discord server'
  public aliases = []
  public permissions = ['BAN_MEMBERS']

  public async run(funo: Funo, msg: Message, args: string[]) {
    const member = msg.guild.member(msg.mentions.users.first() || args[0])

    if (!member) return msg.channel.send(Error('You must provide a user to kick'))

    if (msg.author.id === member.id) return msg.channel.send(Error('You cannot kick yourself'))

    if (msg.author.id !== msg.guild.ownerID) {
      if (member.highestRole.position > msg.member.highestRole.position) {
        return msg.channel.send(Error('You cannot kick a users who has a higher role than you'))
      }

      if (member.highestRole.position === msg.member.highestRole.position) {
        return msg.channel.send(Error('You cannot kick this user as their highest role is the same as yours'))
      }
    }

    if (msg.guild.member(funo.user).highestRole.position <= member.highestRole.position) {
      return msg.channel.send(Error('Funo cannot kick this user'))
    }

    const reason = args.length > 1 ? args.slice(1).join(' ') : 'No reason given.'

    await member.send(RichEmbed(`You have been kicked from \`${msg.guild.name}\``, null, [
      ['By:', `<@${msg.author.id}>`, false],
      ['Reason:', `\`\`\`${reason}\`\`\``, false],
    ], null, 'RED'))

    await member.kick()

    return msg.channel.send(RichEmbed(`<@${member.id}> has been kicked from this server`))
  }

})()
