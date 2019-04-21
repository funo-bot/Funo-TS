import { Message } from 'discord.js'

import { Funo } from '@/Funo'

export enum Category {
  Fun,
  Music,
  Utilities,
  Moderation,
  ImageManipulation,
}

export interface Command {

  name: string
  category: Category
  description: string
  aliases?: string[]
  permissions?: string[]

  run(funo: Funo, msg: Message): void

}
