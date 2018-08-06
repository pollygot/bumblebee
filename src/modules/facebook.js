const Axios = require('axios')

// CONFIG
const FACEBOOK_POST_TO_PAGE_FEED = 'FACEBOOK_POST_TO_PAGE_FEED'

// Start a listener on the queue to process Job Events sent to the API for this module
export function listen(queue) {

  // SLACK_POST_MESSAGE
  queue.process(FACEBOOK_POST_TO_PAGE_FEED, (job, done) => {
    if (!job.data.feed_id) return done(new Error('feed_id is required'))
    if (!job.data.message) return done(new Error('message is required'))
    if (!job.data.access_token) return done(new Error('access_token is required'))
    let url = `https://graph.facebook.com/${job.data.feed_id}/feed`
    sendMessage(url, { 
      message: job.data.message,
      access_token: job.data.access_token
    })
    .then(res => {
      job.log(res)
      return done()
    })
    .catch(e => done(new Error(e)))
  })

}

const sendMessage = (webhook, payload) => (Axios.post(webhook, payload))
