import DiscordOauth from 'discord-oauth2'
import Server from 'socket.io'

import { Funo } from './src/Funo'
import { Logger } from './src/utils'

(async () => {
  if(!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is not set in ENV')
  if(!process.env.MONGO_URL) throw new Error('MONGO_URL is not set in ENV')
  if(!process.env.MONGO_USER) throw new Error('MONGO_USER is not set in ENV')
  if(!process.env.MONGO_PASS) throw new Error('MONGO_PASS is not set in ENV')
  if(!process.env.OAUTH_SECRET) throw new Error('OAUTH_SECRET is not set in ENV')

  // tslint:disable
  new Funo(
    process.env.DISCORD_TOKEN,
    {
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
  })

  io.listen(ioPort)
  ioLogger.info(`Listening on *:${ioPort}`)
})()

