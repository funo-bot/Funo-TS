export interface Config {
  music: {
    ytKey: string,
    lavalinkHost: string,
    lavalinkPort: number,
  },
  db: {
    url: string,
    user: string,
    password: string,
    name?: string,
  }
}
