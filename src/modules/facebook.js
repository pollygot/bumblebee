const config = require('config')
const Axios = require('axios')
const APPS = config.get('APPS')
const { JOB_KEYS } = require('../constants')
const GRAPH_URL = `https://graph.facebook.com`

// Start a listener on the queue to process Job Events sent to the API for this module
export function listen(queue) {

  // Post to feed
  queue.process(JOB_KEYS.FACEBOOK.POST_TO_FEED, (job, done) => {
    postToFeed(job).then(res => {
      job.log(res)
      return done()
    }).catch(e => done(new Error(e)))
  })

}

const postToFeed = (job) => {
  return new Promise((resolve, reject) => {
    let { data:payload } = job
    if (!payload.feed_id) return reject('feed_id is required')
    if (!payload.message) return reject('message is required')

    let url = `${GRAPH_URL}/${payload.feed_id}/feed`

    let app = APPS.find(x => x.key === payload.appKey)
    let data = {
      message: payload.message,
      access_token: app.config.accessToken
    }
    Axios.post(url, data)
    .then(result => { return resolve(result) })
    .catch(error => { return reject(error) })
  })
}
