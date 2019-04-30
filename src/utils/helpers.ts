import { RichEmbed as RE } from 'discord.js'

export type RichEmbedField = [string, (string | number)?, boolean?]

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
    .setThumbnail(src)

  if (title) e.setTitle(title)
  if (desc) e.setDescription(desc)

  return e
}
