
import { Funo } from './src/utils/init'
import { io, logger, port } from './src/utils/socket'

(async () => {
  await Funo.init()

  io.listen(port)
  logger.info(`Listening on *:${port}`)
})()
