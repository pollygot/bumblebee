require("babel-core/register")
require("babel-polyfill")

const config = require('config')
const { JOB_KEYS } = require('./constants')
const Kue = require('kue')
const Facebook = require('./modules/facebook')
const Mailgun = require('./modules/mailgun')
// const Slack = require('./modules/slack')
// const Trello = require('./modules/trello')
const express = require('express')
const app = express()
const cors = require('cors')
const { body, check, validationResult } = require('express-validator/check');

// DECLARE CONFIG
const REDIS_HOST = process.env.REDIS_HOST || config.get('REDIS.host') // can come from Docker
const REDIS_PORT = +(config.get('REDIS.port') || 6379)
const API_PORT = +(config.get('API.port') || 3000)
const APPS = config.get('APPS')
const shouldEnableCors = config.get('API.cors') || false
const shouldExposeKue = config.get('KUE') || false

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
// Slack.listen(Queue)
// Trello.listen(Queue)

const createJob = function (type, data, options) {
  return new Promise((resolve, reject) => {
    var job = Queue.create(type, data)
    job.save(err => {
      if (err) return reject(err)
      else return resolve(job.id)
    })
  })
}

//
// Expose the API
//

app.use(express.json())
if (shouldEnableCors) app.use(cors())
const generalValidationRules = [ // rules used in every POST
  check('appKey')
    .exists()
    .custom((value, { req }) => APPS.some(x => (x.key == value))).withMessage("App does not exist"),
  check('data').exists()
]

app.post('/*', generalValidationRules, async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })

  const { appKey, data, options } = req.body
  data.appKey = appKey

  createJob(req.path, data, options)
  .then(jobId => { res.json({ jobId: jobId }) })
  .catch(err => { res.status(500).send(err) })
})


app.listen(API_PORT, () => { console.log(`API listening on port ${API_PORT}`) })


//
// Expose Kue
//
if (shouldExposeKue) {
  const KUE_PORT = +(config.get('KUE.port'))
  if (KUE_PORT) Kue.app.listen(KUE_PORT)
}
