import pino from 'pino'

export default (_, inject) => {
  inject(
    'log',
    pino({
      prettyPrint:
        process.env.NODE_ENV === 'development' ? { colorize: true } : false,
      level: process.env.NODE_ENV === 'development' ? 'trace' : 'info',
    })
  )
}
