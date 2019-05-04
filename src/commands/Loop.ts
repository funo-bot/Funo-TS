import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Guild } from '../Guild'
import { Error, RichEmbed, Track } from '../utils'

export const Loop = new (class extends Command {

  public name = 'loop'
  public category = Category.Music
  public description = 'Toggle the loop setting'
  public aliases = ['l', 'repeat']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[], guild: Guild) {
    const loop = typeof args[0] === 'string' ? args[0].toLowerCase() : ''

    if(loop === 'off') guild.loop = 'off'
    else if(loop === 'queue') guild.loop = 'queue'
    else if(loop === 'track') guild.loop = 'track'
    else {
      if(guild.loop === 'off') guild.loop = 'queue'
      if(guild.loop === 'queue') guild.loop = 'track'
      else guild.loop = 'off'
    }

    msg.channel.send(RichEmbed(`Guild loop set to '${guild.loop}'`))
  }

})()
