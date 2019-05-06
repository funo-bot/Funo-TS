import { Message } from 'discord.js'
import { promise as ping } from 'ping'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, RichEmbed } from '../utils'
import { platform } from 'os';

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

    const start = Date.now()
    const result = await ping.probe(args[0], {
      timeout: 10,
      min_reply: pingCount,
    }).catch((err: any) => {
      return message.edit(Error('An unknown error occurred whilst making your request'))
    })
    const end = Date.now()

    if(!result.alive) return message.edit(Error('Host unreachable'))

    let min = result.min
    let avg = result.min
    let max = result.min

    if(platform() === 'linux') {
      const res = /min\/avg\/max = (.*?)\/(.*?)\/(.*?) /.exec(result.output)
      if(!res) return message.edit(Error('An unknown error occurred whilst making your request'))

      min = res[1]
      avg = res[2]
      max = res[3]
    }

    min = parseFloat(min).toFixed(2)
    avg = parseFloat(avg).toFixed(2)
    max = parseFloat(max).toFixed(2)

    message.edit(RichEmbed('Ping Results', `${result.host} (${result.numeric_host.replace(')', '')})`, [
      ['Average', `${parseInt(avg, 10)}ms`],
      ['Min', `${parseInt(min, 10)}ms`],
      ['Max', `${parseInt(max, 10)}ms`],
      ['# of requests', pingCount],
      ['Total Time', `${end - start}ms`],
      ['Range', `${max - min}ms`],
    ]))
  }

})()
