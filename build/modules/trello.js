'use strict'

var _exports = (module.exports = {})
const Trello = require('node-trello')

// Start a listener on the queue to process Job Events sent to the API for this module
_exports.listen = (Queue, appConfig) => {
  var queue = new Queue(appConfig.key, appConfig.queue)
  queue.process((job, done) => process(appConfig, job, done))
  return queue
}

const process = (appConfig, job, done) => {
  let { action, payload } = job.data
  switch (action.toString()) {
    case 'CREATE_CARD':
      return createCard(appConfig, payload, done)
    default:
      return done(new Error('Invalid action: ' + action))
  }
}

const createCard = (appConfig, payload, done) => {
  const TRELLO_KEY = appConfig.config.key
  const TRELLO_TOKEN = appConfig.config.token
  const trello = new Trello(TRELLO_KEY, TRELLO_TOKEN)
  trello.post(
    '/1/cards/',
    {
      idList: payload.list_id,
      name: payload.name,
      desc: payload.desc || '',
    },
    (err, result) => {
      if (err) return reject(new Error(err))
      return done(null, result)
    }
  )
}
