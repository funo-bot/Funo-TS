import { Message } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'

export const Cat = new (class implements Command {

  public name = 'cat'
  public category = Category.Fun
  public description = 'Get a lovely picture of a cat'
  public aliases = ['kitten', 'cats']

  public async run(funo: Funo, msg: Message) {
    //
  }

})()
