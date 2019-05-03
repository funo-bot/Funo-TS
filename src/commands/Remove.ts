import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, RichEmbed, Track } from '../utils'

export const Remove = new (class extends Command {

  public name = 'remove'
  public category = Category.Music
  public description = 'Remove a song from the queue'
  public aliases = ['r', 'rm', 'delete']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if (!guild.queue.length) return msg.channel.send(Error('No tracks in queue'))
    if (!args.length) return msg.channel.send(Error('Please provide the track number to remove'))

    const trackNo = parseInt(args[0], 10)
    if (isNaN(trackNo) || !guild.queue[trackNo - 1]) {
      return msg.channel.send(Error('Please provide a valid track number'))
    }

    const track = guild.removeSong(trackNo)

    msg.channel.send(Track('Removed from Queue', track))
  }

})()
