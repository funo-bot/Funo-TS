import fetch from 'node-fetch'

export class API {

  constructor(private userToken: string, private botToken: string) { }

  public async me() {
    return this.get('users/@me')
  }

  public async guilds() {
    return this.get('users/@me/guilds')
  }

  public async guild(id: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const guild = await this.get(`guilds/${id}`, 'Bot').catch(([status, err]) => resolve(null))

      resolve(guild)
    })
  }

  private async get(path: string, tokenType: 'Bearer' | 'Bot' = 'Bearer'): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(`https://discordapp.com/api/${path}`, {
        headers: {
          Authorization: `${tokenType} ${tokenType === 'Bearer' ? this.userToken : this.botToken}`,
        },
      })

      if(res.status !== 200) return reject([res.status, await res.json()])

      resolve(await res.json())
    })
  }

}
