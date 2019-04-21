import { Message } from 'discord.js'

import { Category, Command } from '@/Command'
import { Funo } from '@/Funo'

export default class Cat implements Command {

  public name = 'cat'
  public category = Category.Fun
  public description = 'Get a lovely picture of a cat'
  public aliases = [ 'kitten', 'cats' ]

  public run(funo: Funo, msg: Message) {
    //
  }

}
