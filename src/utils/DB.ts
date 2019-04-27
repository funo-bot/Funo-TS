import { Collection, Db, MongoClient } from 'mongodb'

import { GuildConfig } from '@/interfaces/GuildConfig'
import { Logger } from '.'

export class DB {

  private logger: Logger = new Logger('DB')
  private initialised: boolean = false

  private db!: Db

  private guilds!: Collection

  constructor(
    private mongoUrl: string,
    private mongoUser: string,
    private mongoPass: string,
    private mongoDb: string = 'funo',
  ) {
    if(!mongoUrl) throw new Error('')
  }

  public async init() {
    if(this.initialised) return this.logger.error('DB.init can only be called once.')
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

  public async getGuildConfig(id: string): Promise<GuildConfig | null> {
    return this.guilds.findOne({ guildId: id }) || null
  }

}
