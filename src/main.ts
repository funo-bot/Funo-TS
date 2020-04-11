
import { Funo } from './utils/init'
import { io, logger, port } from './utils/socket'

(async () => {
  await Funo.init()

  io.listen(port)
  logger.info(`Listening on *:${port}`)
})()
