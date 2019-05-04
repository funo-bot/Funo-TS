import { Message, TextChannel } from 'discord.js'
import fetch from 'node-fetch'
import search from 'youtube-search'

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

    const { results, pageInfo } = await search(args.join(' '), {
      maxResults: 1,
      key: funo.config.music.ytKey,
      // videoCategoryId: '10',
      // type: 'video',
    })

    if (!results.length) return msg.channel.send(Error('No results were found for that query'))

    const player = await guild.initPlayer(msg.member.voiceChannel.id)

    const { link, thumbnails } = results[0]

    const { track, info: { title, author, length } } = await this.getTrackByLink(link, funo.playerManager.nodes.first())

    const guildTrack: GuildTrack = {
      link,
      track,
      title,
      author,
      length,
      duration: this.duration(length),
      thumb: thumbnails.high ? thumbnails.high.url : null,
      addedBy: msg.author,
    }

    guild.queueChannel = (msg.channel as TextChannel)
    if (!guild.queue.length) {
      guild.queue.push(guildTrack)
      player.play(track)

      msg.channel.send(Track('Now Playing', guildTrack))
    } else {
      guild.queue.push(guildTrack)

      msg.channel.send(Track('Added to Queue', guildTrack))
    }
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
