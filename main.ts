import { Funo } from './src/Funo'

if(!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is not set in ENV')
if(!process.env.MONGO_URL) throw new Error('MONGO_URL is not set in ENV')
if(!process.env.MONGO_USER) throw new Error('MONGO_USER is not set in ENV')
if(!process.env.MONGO_PASS) throw new Error('MONGO_PASS is not set in ENV')

// tslint:disable-next-line
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
