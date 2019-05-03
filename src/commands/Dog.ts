import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'

import fetch from 'node-fetch'
import { Image } from 'utils'

export const Dog = new (class extends Command {

  public name = 'dog'
  public category = Category.Fun
  public description = 'Get a lovely picture of a dog'
  public aliases = ['puppy', 'dogs']

  public async run(funo: Funo, msg: Message) {
    const body: any = fetch('https://random.dog/woof.json')
      .then(res => res.json())

    msg.channel.send(Image(body.url, 'Woof 🐶')
      .setColor('PURPLE')
    )
  }

})()
