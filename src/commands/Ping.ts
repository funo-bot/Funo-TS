import { Message } from 'discord.js'
import { promise as ping } from 'ping'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, RichEmbed } from '../utils'

export const Ping = new (class extends Command {

  public name = 'ping'
  public category = Category.Utilities
  public description = 'Ping the bot'
  public aliases = []
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    if(!args[0]) return msg.channel.send(RichEmbed(`Pong! **${Date.now() - msg.createdTimestamp}ms**`))

    const message = (await msg.channel.send(RichEmbed('Working, please wait...')) as Message)

    let pingCount: number = 1
    if(args[1] && !isNaN(parseInt(args[1], 10))) pingCount = parseInt(args[1], 10)

    if(pingCount > 10) return message.edit(Error('A maximum of 10 requests can be made'))

    const result = await ping.probe(args[0], {
      timeout: 10,
      min_reply: pingCount,
    }).catch((err: any) => {
      return message.edit(Error('An unknown error occurred whilst making your request'))
    })

    if(!result.alive) return message.edit(Error('Host unreachable'))

    message.edit(RichEmbed('Ping Results', `${result.host} (${result.numeric_host})`, [
      ['Average', `${parseInt(result.avg, 10)}ms`],
      ['Min', `${parseInt(result.min, 10)}ms`],
      ['Max', `${parseInt(result.max, 10)}ms`],
      ['# of requests', pingCount],
      ['Standard Deviation', `${parseInt(result.stddev, 10)}ms`],
    ]))
  }

})()
