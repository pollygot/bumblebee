var exports       = module.exports = {}
const axios       = require('axios')
const GRAPH_URL   = `https://graph.facebook.com`

// Start a listener on the queue to process Job Events sent to the API for this module
exports.listen = (Queue, appConfig) => {
  var queue = new Queue(appConfig.key, appConfig.redis)
  queue.process((job, done) => process(appConfig, job, done))
  return queue
}

const process = (appConfig, job, done) => {
  let { action, payload } = job.data
  switch (action.toString()) {
    case 'POST_TO_FEED':
      return postToFeed(appConfig, payload, done)
    default:
      return done(new Error('Invalid action: ' + action))
  }
}

const postToFeed = (appConfig, payload, done) => {
  let { feedId, message } = payload
  let url = `${GRAPH_URL}/${feedId}/feed`
  let data = {
    message: message,
    access_token: appConfig.config.accessToken
  }
  axios.post(url, data)
    .then(result => { return done(null, result) })
    .catch(error => { return reject(new Error(error)) })
}
