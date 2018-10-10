var exports = module.exports = {}
const axios = require('axios')

// Start a listener on the queue to process Job Events sent to the API for this module
exports.listen = (Queue, appConfig) => {
  var queue = new Queue(appConfig.key, appConfig.queue)
  queue.process((job, done) => process(appConfig, job, done))
  return queue
}

const process = (appConfig, job, done) => {
  let { action, payload } = job.data
  switch (action.toString()) {
    case 'SEND_MESSAGE':
      return sendMessage(appConfig, payload, done)
    default:
      return done(new Error('Invalid action: ' + action))
  }
}

const sendMessage = async (appConfig, payload, done) => {
  const SMS_URL = 'https://rest.nexmo.com/sms/json'
  let data = {
    api_key: appConfig.config.apiKey,
    api_secret: appConfig.config.apiSecret,
    to: payload.to,
    from: payload.from,
    text: payload.text,
  }
  let {data: result} = await axios.post(SMS_URL, data).catch(e => { 
    return done(new Error(e)) 
  })
  return done(null, result)
}
