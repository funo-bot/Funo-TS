import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, RichEmbed } from '../utils'

export const Queue = new (class extends Command {

  public name = 'queue'
  public category = Category.Music
  public description = 'View the song queue'
  public aliases = ['q', 'songs']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if (!guild.queue.length) return msg.channel.send(Error('No tracks in queue'))

    msg.channel.send(
      RichEmbed(
        'Song Queue', '',
        guild.queue.map((t, i) => [
          `${i + 1}. ${t.title}`, `${t.author} - Added by ${t.addedBy.tag}`, false,
        ]),
      ),
    )
  }

})()
