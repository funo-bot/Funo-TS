import { Funo } from './src/Funo'

if(!process.env.DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is not set in ENV')

// tslint:disable-next-line
new Funo(process.env.DISCORD_TOKEN)
