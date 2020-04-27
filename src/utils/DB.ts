import { Collection, Db, MongoClient } from 'mongodb'

import { GuildConfig } from '../interfaces/GuildConfig'
import { defaultConfig, Logger } from '../utils'
import { Guild } from '../Guild'

export class DB {

  private logger: Logger = new Logger('DB')
  private initialised: boolean = false

  private db!: Db

  private guilds!: Collection

  private guildConfig: {
    [k: string]: Partial<GuildConfig>,
  } = {}

  constructor(
    private mongoUrl: string,
    private mongoUser: string,
    private mongoPass: string,
    private mongoDb: string = 'funo',
  ) {
    if (!mongoUrl) throw new Error('')
  }

  public async init() {
    if (this.initialised) return this.logger.error('DB.init can only be called once.')
    this.initialised = true

    const client = await MongoClient.connect(this.mongoUrl, {
      useNewUrlParser: true,
      auth: {
        user: this.mongoUser,
        password: this.mongoPass,
      },
    })
    this.db = client.db(this.mongoDb)

    this.logger.info(`Connected to Mongo with db '${this.mongoDb}'`)

    this.guilds = this.db.collection('guilds')
  }

  public async getGuild(id: string): Promise<GuildConfig> {
    let config: Partial<GuildConfig> = this.guildConfig[id]

    if (!config) {
      this.guildConfig[id] = config = (await this.guilds.findOne({ guildId: id }) || {})
    }

    return Object.assign(defaultConfig, config)
  }

  public async getPrefix(guildId: string): Promise<string> {
    return (await this.getGuild(guildId)).prefix
  }

  public async setPrefix(guildId: string, prefix: string) {
    if (prefix === await this.getPrefix((guildId))) return

    this.guildConfig[guildId].prefix = prefix
    await this.updateGuild(guildId, { prefix })
  }

  private async updateGuild(guildId: string, doc: Partial<GuildConfig>) {
    await this.guilds.updateOne({ guildId }, {
      $set: doc,
    }, { upsert: true })
  }

  public async initGuild(guild: Guild) {
    const result = await this.guilds.findOne({ guildId: guild.id })

    if (!result) {
      await this.guilds.insertOne({
        guildId: guild.id,
        ...defaultConfig,
      })
    }
  }

}
