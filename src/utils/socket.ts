import DiscordOauth from 'discord-oauth2'
import Server from 'socket.io'

import { API, Logger } from '.'
import { RichEmbed, Track } from './helpers'
import { Funo } from './init'
import { TextChannel } from 'discord.js';

export const io = Server()
export const logger = new Logger('IO')
export const port = 3000

const oauth = (new (DiscordOauth as any)() as DiscordOauth.oauth)

const events = ['funo:playing', 'funo:queued']

io.on('connect', socket => {
  let loggedIn: boolean = false

  socket.on('oauthCode', async (code: string, redirectUri: string, scope: string, ack) => {
    ack(await oauth.tokenRequest({
      client_id: Funo.user.id,
      client_secret: (process.env.OAUTH_SECRET as string),
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
      scope,
    }))
  })

  socket.on('login', async token => {
    if(loggedIn) return

    console.log('login')

    // TODO: Verify token
    loggedIn = true

    const api = new API(token, (process.env.DISCORD_TOKEN as string))

    let me: any = null

    socket.on('me', async ack => {
      if(typeof ack !== 'function') return

      ack(me = await api.me())
    })

    socket.on('guilds', async ack => {
      if(typeof ack !== 'function') return

      ack(await api.guilds())
    })

    socket.on('guild', async (id, ack) => {
      if(typeof id !== 'string') return
      if(typeof ack !== 'function') return

      ack(await api.guild(id))
    })

    socket.on('playing', async (id, ack) => {
      if(typeof id !== 'string') return
      if(typeof ack !== 'function') return

      const guild = Funo.getGuild(id)
      if(!guild) return ack(null)

      const track = guild.currentTrack
      if(!track) return ack(null)

      ack({
        ...track,
        addedBy: track.addedBy.id,
      })
    })

    socket.on('play', async (id, query) => {
      if(typeof id !== 'string') return
      if(typeof query !== 'string') return

      const guild = Funo.getGuild(id)
      if(!guild) return

      const { results, pageInfo } = await guild.ytSearch(query)
      console.log(results[0])

      await guild.initPlayer('566033320014774292')

      if(!me) me = await api.me()

      const track = await guild.getTrack(results[0], {
        id: me.id,
        tag: `${me.username}#${me.discriminator}`,
      })
      if (!track) return

      const channel = guild.queueChannel = new TextChannel(guild.guild, {
        id: '566028853814755356',
      })
      if (!guild.queue.length) {
        const trackNo = guild.enqueue(track)
        guild.play(trackNo)
      } else {
        guild.enqueue(track)

        channel.send(Track('Added to Queue', track))
      }
    })

    socket.on('next', async id => {
      if(typeof id !== 'string') return

      const guild = Funo.getGuild(id)
      if(!guild) return

      if(guild.queueChannel) {
        if(!me) me = await api.me()

        guild.queueChannel.send(
          RichEmbed(`<@!${me.id}> skipped the current song from the Funo dashboard.`),
        )
      }
      guild.skipSong()
    })

    for await (const event of events) {
      Funo.on(event, (...args: any) => socket.emit(event, ...args))
    }
  })
})
