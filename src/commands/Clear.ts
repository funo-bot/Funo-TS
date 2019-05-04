import { Message, TextChannel } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, RichEmbed } from '../utils'

export const Clear = new (class extends Command {

  public name = 'clear'
  public category = Category.Music
  public description = 'Clear the music queue'
  public aliases = ['c', 'clr']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if (!msg.member.voiceChannel) return msg.channel.send(Error('You must be in a voice channel to use this command'))

    guild.queueChannel = (msg.channel as TextChannel)
    guild.clearQueue()
    msg.channel.send(RichEmbed('Queue cleared, leaving channel'))
  }

})()
