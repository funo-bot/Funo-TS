export interface Config {
  music: {
    ytKey: string,
  },
  db: {
    url: string,
    user: string,
    password: string,
    name?: string,
  }
}
