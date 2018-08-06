const config = require('config')
const validator = require('validator')
const Mailgun = require('mailgun-js')

// CONFIG
const MAILGUN_KEY = config.get('MAILGUN.apikey') || ''
const MAILGUN_DOMAIN = config.get('MAILGUN.domain') || ''
const JOB_SEND_MESSAGE = 'MAILGUN_SEND_MESSAGE'

const mailgun = Mailgun({ 
  apiKey: MAILGUN_KEY, 
  domain: MAILGUN_DOMAIN
})

// Start a listener on the queue to process Job Events sent to the API for this module
export function listen (queue) {

  // MAILGUN_SEND_MESSAGE
  queue.process(JOB_SEND_MESSAGE, (job, done) => { 
    sendMessage(job.data)
    .then(res => {
      job.log(res)
      return done()
    })
    .catch(e => done(new Error(e)))
  })

}

const sendMessage = (payload) => {
  return new Promise((resolve, reject) => {
    if (!payload.to || !validator.isEmail(payload.to)) return reject('invalid "to" address')
    if (!payload.from || !validator.isEmail(payload.from)) return reject('invalid "from" address')
    if (!payload.subject) return reject('invalid subject')
    if (!payload.text) return reject('invalid text')
    let data = {
      from: (payload.sender) ? `${payload.sender} <${payload.from}>` : `<${payload.from}>`,
      to: payload.to,
      subject: payload.subject,
      text: payload.text
    }
    mailgun.messages().send(data, (error, result) => {
      if (error) return reject(error)
      return resolve(result)
    })
  })
}
