const Axios = require('axios')

// CONFIG
const SLACK_POST_MESSAGE = 'SLACK_POST_MESSAGE'

// Start a listener on the queue to process Job Events sent to the API for this module
export function listen(queue) {

  // SLACK_POST_MESSAGE
  queue.process(SLACK_POST_MESSAGE, (job, done) => {
    sendMessage(job.data.webhook, job.data.payload)
    .then(res => {
      job.log(res)
      return done()
    })
    .catch(e => done(new Error(e)))
  })

}

const sendMessage = (webhook, payload) => (Axios.post(webhook, payload))
