import { Message, DiscordAPIError } from 'discord.js'

import { Category, Command } from '../Command'
import { Funo } from '../Funo'
import { RichEmbed, Image } from '../utils'

export const Avatar = new (class implements Command {

    public name = 'avatar'
    public category = Category.Moderation
    public description = 'Display yours or another users avatar'
    public aliases = ['av','pfp']
    public permissions = []

    public async run(funo: Funo, msg: Message, args: string[]) {
        let target = msg.mentions.users.first() || msg.author;

        msg.channel.send(Image(msg.author.displayAvatarURL))
    }

})()