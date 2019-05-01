import { Message } from 'discord.js'
import search from 'youtube-search'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Error, Image, RichEmbed } from '../utils'

export const Play = new (class implements Command {

  public name = 'play'
  public category = Category.Music
  public description = 'Play music'
  public aliases = ['p', 'add']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[]) {
    if (!msg.member.voiceChannel) {
      return msg.channel.send(Error('You must be in a voice channel to use this command'))
    }

    const { results, pageInfo } = await search(args.join(' '), {
      maxResults: 1,
      key: funo.config.music.ytKey,
      videoCategoryId: '10',
      type: 'video',
    })

    if (!results.length) return msg.channel.send(Error('No results were found for that query'))

    const track = results[0]
    const thumb = track.thumbnails.default
    msg.channel.send(
      RichEmbed(track.title, track.channelTitle, [], thumb ? thumb.url : null)
        .setURL(track.link)
        .setAuthor('Now Playing')
        .setFooter('0:00'),
    )

    // const fields: any[] = []
    // let i = 0
    // for (const result of results) {
    //   fields.push([`${++i}. ${result.title}`, result.channelTitle, false])
    // }

    // const message = (await msg.channel.send(RichEmbed('Results', null, fields)) as Message)
  }

})()
