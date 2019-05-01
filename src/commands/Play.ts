import { Message } from 'discord.js'
import fetch from 'node-fetch'
import search from 'youtube-search'

import { Node } from 'discord.js-lavalink'
import { URLSearchParams } from 'url'
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
    const player = await funo.playerManager.join({
      guild: msg.guild.id,
      channel: msg.member.voiceChannel.id,
      host: funo.playerManager.nodes.first().host,
    })

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

    const { link, thumbnails } = results[0]

    const { track, info: { title, author, length } } = await this.getTrackByLink(link, funo.playerManager.nodes.first())
    player.play(track)

    msg.channel.send(
      RichEmbed(title, author, [], thumbnails.high ? thumbnails.high.url : null)
        .setURL(link)
        .setAuthor('Now Playing')
        .setFooter(this.duration(length)),
    )
  }

  private async getTrackByLink(link: string, node: Node) {
    const params = new URLSearchParams()
    params.append('identifier', `ytsearch: ${link}`)

    return fetch(`http://${node.host}:${node.port}/loadtracks?${params.toString()}`, {
      headers: {
        Authorization: node.password || '',
      },
    }).then(res => res.json())
      .then(data => data.tracks[0])
      .catch(err => {
        return null
      })
  }

  private duration(ms: number) {
    const seconds = Math.floor((ms / 1000) % 60),
      minutes = Math.floor((ms / (1000 * 60)) % 60),
      hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

    const m = (minutes < 10) ? '0' + minutes : minutes
    const s = (seconds < 10) ? '0' + seconds : seconds

    return m + ':' + s
  }

})()
