import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { RichEmbed } from '../utils'

export const Ping = new (class extends Command {

  public name = 'ping'
  public category = Category.Utilities
  public description = 'Ping the bot'
  public aliases = []
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    msg.channel.send(RichEmbed(`Pong! **${Date.now() - msg.createdTimestamp}ms**`))
  }

})()
