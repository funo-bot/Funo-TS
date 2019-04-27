import chalk from 'chalk'

export default class Logger {

  constructor(private moduleName: string, private systemName: string = 'Funo') { }

  public debug(...args: any) {
    this.print(chalk.green('DBG'), ...args)
  }

  public info(...args: any) {
    this.print(chalk.blueBright('INF'), ...args)
  }

  public error(...args: any) {
    this.print(chalk.redBright('ERR'), ...args)
  }

  public warn(...args: any) {
    this.print(chalk.keyword('orange')('WRN'), ...args)
  }

  private print(type: string, ...args: any) {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false })
    // tslint:disable-next-line:no-console
    console.log(
      `[${chalk.yellow(time)}] [${chalk.magenta(this.systemName)}.${chalk.cyan(this.moduleName)}] [${type}]`, ...args,
    )
  }

}
