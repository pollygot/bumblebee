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
const shouldEnableCors = config.get('API.cors') || false

//
// Set up Kue
//
const Queue = Kue.createQueue({
  redis: { host: REDIS_HOST, port: REDIS_PORT },
})
Queue.on('error', err => { console.log('Oops... ', err) })
Queue.watchStuckJobs(1000)

// Start modules
Facebook.listen(Queue)
Mailgun.listen(Queue)
Slack.listen(Queue)
Trello.listen(Queue)

//
// Expose the App
//
Kue.app.listen(EXPRESS_PORT)
if (shouldEnableCors) {
  Kue.app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  })
}
console.log(`Kue listening on localhost:${EXPRESS_PORT}`)
