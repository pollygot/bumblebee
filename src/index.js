const config = require('config')
const Kue = require('kue')
const Facebook = require('./modules/facebook')
const Mailgun = require('./modules/mailgun')
const Slack = require('./modules/slack')
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
Facebook.listen(Queue)
Mailgun.listen(Queue)
Slack.listen(Queue)
Trello.listen(Queue)

// Expost the App
Kue.app.listen(EXPRESS_PORT)
console.log(`Kue listening on localhost:${EXPRESS_PORT}`)

Queue.on('error', function (err) {
  console.log('Oops... ', err)
})
Queue.watchStuckJobs(1000)