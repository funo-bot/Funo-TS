import { Message, MessageReaction, User } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, RichEmbed, Track } from '../utils'

const PAGE_SIZE = 10

export const Queue = new (class extends Command {

  public name = 'queue'
  public category = Category.Music
  public description = 'View the song queue'
  public aliases = ['q', 'songs']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if (!guild.queue.length) return msg.channel.send(Error('No tracks in queue'))

    if(guild.player && guild.player.playing && guild.currentTrack) {
      msg.channel.send(Track('Current Song', guild.currentTrack))
    }

    this.sendQueue(msg, guild)
  }

  private async sendQueue(msg: Message, guild: Guild, page: number = 1, message?: Message) {
    const pages = guild.queue.length <= PAGE_SIZE ? 1 : Math.ceil(guild.queue.length / PAGE_SIZE)

    const embed = RichEmbed(
      'Song Queue', '',
      guild.queue.slice(page === 1 ? 0 : (page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((t, i) => [
        `${((page - 1) * PAGE_SIZE) + i + 1}. ${t.title}`, `${t.author} - Added by ${t.addedBy.tag}`, false,
      ]),
    ).setFooter(`Page ${page}/${pages}`)

    if(!message) message = (await msg.channel.send(embed) as Message)
    else {
      message.clearReactions()
      message = await message.edit(embed)
    }

    if(page - 1 > 0) await message.react('⬆')
    if(page + 1 <= pages) message.react('⬇')

    const filter = (reaction: MessageReaction, user: User) => {
      return ['⬆', '⬇'].includes(reaction.emoji.name) && user.id === msg.author.id
    }

    message.awaitReactions(filter, { max: 1, time: 60000 }).then(async collected => {
      const reaction = collected.first()
      if(!reaction) return

      if (reaction.emoji.name === '⬆') {
        this.sendQueue(msg, guild, page - 1, message)
      } else if(reaction.emoji.name === '⬇') {
        this.sendQueue(msg, guild, page + 1, message)
      }
    })

    return embed
  }

})()
