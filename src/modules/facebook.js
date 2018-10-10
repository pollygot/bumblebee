var exports       = module.exports = {}
const axios       = require('axios')
const GRAPH_URL   = `https://graph.facebook.com`

// Start a listener on the queue to process Job Events sent to the API for this module
exports.listen = (Queue, appConfig) => {
  var queue = new Queue(appConfig.key, appConfig.queue)
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

const postToFeed = async (appConfig, payload, done) => {
  let { feed_id, message } = payload
  let url = `${GRAPH_URL}/${feed_id}/feed`
  let data = {
    message: message,
    access_token: appConfig.config.accessToken
  }
  let { data: result } = await axios.post(url, data).catch(e => {
    return done(new Error(e))
  })
  return done(null, result)
}
