const config = require('config')
const validator = require('validator')
const Mailgun = require('mailgun-js')
const APPS = config.get('APPS')
const { JOB_KEYS } = require('../constants')

// Start a listener on the queue to process Job Events sent to the API for this module
export function listen (queue) {

  queue.process(JOB_KEYS.MAILGUN.SEND, (job, done) => {
    sendMessage(job.data).then(res => {
      job.log(res)
      return done()
    }).catch(e => done(new Error(e)))
  })

}

const sendMessage = (job) => {
  return new Promise((resolve, reject) => {
    let { data:payload } = job
    if (!payload.to || !validator.isEmail(payload.to)) return reject('invalid "to" address')
    if (!payload.from || !validator.isEmail(payload.from)) return reject('invalid "from" address')
    if (!payload.subject) return reject('invalid subject')
    if (!payload.text) return reject('invalid text')

    let app = APPS.find(x => x.key === payload.appKey)
    let mailgun = Mailgun({
      apiKey: app.config.apikey,
      domain: app.config.domain
    })
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
