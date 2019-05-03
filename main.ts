import DiscordOauth from 'discord-oauth2'
import Server from 'socket.io'

import { Funo } from './src/Funo'
import { API, Logger } from './src/utils'

(async () => {
  if (!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is not set in ENV')
  if (!process.env.MONGO_URL) throw new Error('MONGO_URL is not set in ENV')
  if (!process.env.MONGO_USER) throw new Error('MONGO_USER is not set in ENV')
  if (!process.env.MONGO_PASS) throw new Error('MONGO_PASS is not set in ENV')
  if (!process.env.OAUTH_SECRET) throw new Error('OAUTH_SECRET is not set in ENV')
  if (!process.env.FUNO_YT_KEY) throw new Error('FUNO_YT_KEY is not set in ENV')
  if (!process.env.LAVALINK_HOST) throw new Error('LAVALINK_HOST is not set in ENV')
  if (!process.env.LAVALINK_PORT) throw new Error('LAVALINK_PORT is not set in ENV')

  const discordToken = process.env.DISCORD_TOKEN

  // tslint:disable
  new Funo(
    discordToken,
    {
      music: {
        ytKey: process.env.FUNO_YT_KEY,
        lavalinkHost: process.env.LAVALINK_HOST,
        lavalinkPort: parseInt(process.env.LAVALINK_PORT, 10),
      },
      db: {
        url: process.env.MONGO_URL,
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
        name: process.env.MONGO_DB,
      },
    },
  )

  const io = Server()
  const ioLogger = new Logger('IO')
  const ioPort = 3000

  const oauth = (new (DiscordOauth as any) as DiscordOauth.oauth)

  io.on('connect', socket => {
    let loggedIn: boolean = false

    socket.on('oauthCode', async (code: string, redirect_uri: string, scope: string, ack) => {
      ack(await oauth.tokenRequest({
        client_id: '332971222897786892',
        client_secret: (process.env.OAUTH_SECRET as string),
        grant_type: "authorization_code",
        code,
        redirect_uri,
        scope,
      }))
    })

    socket.on('login', async token => {
      if(loggedIn) return

      // TODO: Verify token
      loggedIn = true

      const api = new API(token, discordToken)

      socket.on('me', async ack => {
        if(typeof ack !== 'function') return

        ack(await api.me())
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
    })
  })

  io.listen(ioPort)
  ioLogger.info(`Listening on *:${ioPort}`)
})()
