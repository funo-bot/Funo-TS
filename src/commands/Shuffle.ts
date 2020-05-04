import { Message, TextChannel } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, shuffleArr, RichEmbed } from '../utils'

export const Shuffle = new (class extends Command {

  public name = 'shuffle'
  public category = Category.Music
  public description = 'Shuffle the guild queue'
  public aliases = []
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if (!msg.member.voiceChannel) return msg.channel.send(Error('You must be in a voice channel to use this command'))

    guild.queueChannel = (msg.channel as TextChannel)
    await shuffleArr(guild.queue)

    return msg.channel.send(RichEmbed('Shuffled queue.'))
  }

})()
