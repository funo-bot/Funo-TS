import { Message, User } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { Image } from '../utils'

export const Avatar = new (class extends Command {

  public name = 'avatar'
  public category = Category.Utilities
  public description = 'Display yours or another users avatar'
  public aliases = ['av', 'pfp']
  public permissions = []

  public async run(funo: Funo, msg: Message, args: string[]) {
    const matches = /^(<@!?(.*)>)/.exec(args[0])

    let target: User
    if(!matches || typeof matches[2] !== 'string') target = msg.author
    else target = await funo.fetchUser(matches[2])

    msg.channel.send(Image(target.displayAvatarURL, 'Avatar for ' + target.username))
  }

})()
