import { RichEmbed as RE, User } from 'discord.js'
import { GuildTrack } from '../Guild'

export type RichEmbedField = [string, (string | number), boolean?]

export function RichEmbed(
  title: string,
  desc?: string | null,
  fields: RichEmbedField[] = [],
  icon?: string | null,
  color: string = 'PURPLE',
) {
  let realTitle: string | null = title
  if (!desc) {
    desc = title
    realTitle = null
  }

  const embed = new RE()
    .setDescription(desc)
    .setColor(color)

  if (realTitle) embed.setTitle(realTitle)
  if (icon) embed.setThumbnail(icon)

  for (const [fTitle, fDesc, fInline] of fields) {
    embed.addField(fTitle, fDesc, typeof fInline === 'undefined' ? true : fInline)
  }

  return embed
}

export function Error(msg: string) {
  return RichEmbed('Error', msg)
}

export function Image(src: string, title?: string, desc?: string) {
  const e = new RE()
    .setImage(src)
    .setColor('PURPLE')

  if (title) e.setTitle(title)
  if (desc) e.setDescription(desc)

  return e
}

export function Track(embedTitle: string, track: GuildTrack) {
  const re = new RE()
    .setAuthor(embedTitle)
    .setTitle(track.title)
    .setDescription(track.author)
    .setURL(track.link)
    .setFooter(`${track.duration} - Added by ${track.addedBy.tag}`)
    .setColor('PURPLE')

  if (track.thumb) re.setThumbnail(track.thumb)

  return re
}

export function shuffleArr(arr: Array<any>) {
  let inputArray: any[] = arr
  for (let i: number = inputArray.length - 1; i >= 0; i--) {
    let randomIndex: number = Math.floor(Math.random() * (i + 1))
    let itemAtIndex: number = inputArray[randomIndex]

    inputArray[randomIndex] = inputArray[i]
    inputArray[i] = itemAtIndex
  }
  return inputArray
}
