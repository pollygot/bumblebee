const config = require('config')
const Kue = require('kue')
const Mailgun = require('./modules/mailgun')


// DECLARE CONFIG
const REDIS_HOST = config.get('REDIS.host') || '127.0.0.1'
const REDIS_PORT = +(config.get('REDIS.port') || 6379)
const EXPRESS_PORT = +(config.get('EXPRESS.port') || 3000)

// Set up Kue
const Queue = Kue.createQueue({
  redis: { host: REDIS_HOST, port: REDIS_PORT },
})

// Start modules
Mailgun.listen(Queue)

// Expost the App
Kue.app.listen(EXPRESS_PORT)
console.log(`Kue listening on localhost:${EXPRESS_PORT}`)
