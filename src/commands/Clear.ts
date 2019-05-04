import { Message, TextChannel } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error } from '../utils'

export const Clear = new (class extends Command {

  public name = 'skip'
  public category = Category.Music
  public description = 'Skip current song'
  public aliases = ['s', 'next']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if (!msg.member.voiceChannel) return msg.channel.send(Error('You must be in a voice channel to use this command'))

    guild.queueChannel = (msg.channel as TextChannel)
    guild.skipSong()
  }

})()
