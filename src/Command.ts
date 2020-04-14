import { Message } from 'discord.js'

import { Funo } from './Funo'
import { Guild } from './Guild'

export enum Category {
  Fun,
  Music,
  Utilities,
  Moderation,
  ImageManipulation,
}

export abstract class Command {

  public abstract name: string
  public abstract category: Category
  public abstract description: string
  public aliases: string[] = []
  public permissions: string[] = []

  public showInHelp: boolean = true

  public abstract run(funo: Funo, msg: Message, args: string[], guild: Guild): Promise<any>

}
