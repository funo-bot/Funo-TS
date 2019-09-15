import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Image } from '../utils'

import client from 'nekos.life'

export const Hug = new (class extends Command {

  public name = 'hug'
  public category = Category.Fun
  public description = 'Hug a user in a Discord server.'
  public aliases = []

  public async run(funo: Funo, msg: Message, args: string[]) {
    const member = msg.guild.member(msg.mentions.users.first() || args[0])

    new client().sfw.hug().then(imageBody => {
      msg.channel.send(Image(imageBody.url, '', `${msg.author} hugs ${member}`))
    })
  }
})