import { Message, TextChannel } from 'discord.js'
import fetch from 'node-fetch'

import { Node } from 'discord.js-lavalink'
import { URLSearchParams } from 'url'
import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild, GuildTrack } from '../Guild'
import { Error, Track } from '../utils'

export const Play = new (class extends Command {

  public name = 'play'
  public category = Category.Music
  public description = 'Play music'
  public aliases = ['p', 'add']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if (!msg.member.voiceChannel) return msg.channel.send(Error('You must be in a voice channel to use this command'))

    const { results, pageInfo } = await guild.ytSearch(args.join(' '))

    if (!results.length) return msg.channel.send(Error('No results were found for that query'))

    await guild.initPlayer(msg.member.voiceChannel.id)

    const track = await guild.getTrack(results[0], msg.author)
    if (!track) return msg.channel.send(Error('An unknown error occurred'))

    guild.queueChannel = (msg.channel as TextChannel)
    if (!guild.queue.length) {
      const trackNo = guild.enqueue(track)
      guild.play(trackNo)
    } else {
      guild.enqueue(track)

      msg.channel.send(Track('Added to Queue', track))
    }
  }

})()
