import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Image } from '../utils'

import fetch from 'node-fetch'

export const Cat = new (class extends Command {

  public name = 'cat'
  public category = Category.Fun
  public description = 'Get a lovely picture of a cat'
  public aliases = ['kitten', 'cats']

  public async run(funo: Funo, msg: Message) {
    const body: any = await fetch('http://aws.random.cat/meow')
      .then(res => res.json())

      msg.channel.send(Image(body.file, 'Meow 🐱')
      .setColor('PURPLE')
    )
  }

})()
