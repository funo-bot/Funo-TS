import { RichEmbed as RE } from 'discord.js'

export type RichEmbedField = [string, (string | number)?, boolean?]

export function RichEmbed(title: string, desc?: string | null, fields: RichEmbedField[] = [], icon?: string) {
  let realTitle: string | null = title
  if(!desc) {
    desc = title
    realTitle = null
  }

  const embed = new RE()
    .setDescription(desc)
    .setColor('PURPLE')

  if(realTitle) embed.setThumbnail(realTitle)
  if(icon) embed.setThumbnail(icon)

  for(const [fTitle, fDesc, fInline] of fields) {
    embed.addField(fTitle, fDesc, typeof fInline === 'undefined' ? true : fInline)
  }

  return embed
}
