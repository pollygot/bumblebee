const config = require('config')
const Kue = require('kue')
const Mailgun = require('./modules/mailgun')
const Trello = require('./modules/trello')

// DECLARE CONFIG
const REDIS_HOST = process.env.REDIS_HOST || config.get('REDIS.host') // can come from Docker
const REDIS_PORT = +(config.get('REDIS.port') || 6379)
const EXPRESS_PORT = +(config.get('EXPRESS.port') || 3000)

// Set up Kue
const Queue = Kue.createQueue({
  redis: { host: REDIS_HOST, port: REDIS_PORT },
})

// Start modules
Mailgun.listen(Queue)
Trello.listen(Queue)

// Expost the App
Kue.app.listen(EXPRESS_PORT)
console.log(`Kue listening on localhost:${EXPRESS_PORT}`)
