var exports = (module.exports = {})
const Mailgun = require('mailgun-js')

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

const sendMessage = (appConfig, payload, done) => {
  let mailgun = Mailgun({
    apiKey: appConfig.config.apikey,
    domain: appConfig.config.domain,
  })
  let data = {
    from: payload.sender
      ? `${payload.sender} <${payload.from}>`
      : `<${payload.from}>`,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
  }
  mailgun.messages().send(data, (error, result) => {
    if (error) return done(new Error(error))
    return done(null, result)
  })
}
