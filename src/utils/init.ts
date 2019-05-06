import { Funo as FunoClass } from '../Funo'

console.log(process.env)

if (!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is not set in ENV')
if (!process.env.MONGO_URL) throw new Error('MONGO_URL is not set in ENV')
if (!process.env.MONGO_USER) throw new Error('MONGO_USER is not set in ENV')
if (!process.env.MONGO_PASS) throw new Error('MONGO_PASS is not set in ENV')
if (!process.env.OAUTH_SECRET) throw new Error('OAUTH_SECRET is not set in ENV')
if (!process.env.FUNO_YT_KEY) throw new Error('FUNO_YT_KEY is not set in ENV')
if (!process.env.LAVALINK_HOST) throw new Error('LAVALINK_HOST is not set in ENV')
if (!process.env.LAVALINK_PORT) throw new Error('LAVALINK_PORT is not set in ENV')

// tslint:disable
export const Funo = new FunoClass(
  process.env.DISCORD_TOKEN,
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