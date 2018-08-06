const config = require('config')
const validator = require('validator')
const Trello = require('node-trello')

// CONFIG
const TRELLO_KEY = config.get('TRELLO.key') || ''
const TRELLO_TOKEN = config.get('TRELLO.token') || ''
const JOB_CREATE_CARD = 'TRELLO_CREATE_CARD'

const trello = new Trello(TRELLO_KEY, TRELLO_TOKEN)

// Start a listener on the queue to process Job Events sent to the API for this module
export function listen (queue) {

  // TRELLO_CREATE_CARD
  queue.process(JOB_CREATE_CARD, (job, done) => { 
    createCard(job.data)
    .then(res => {
      job.log(res)
      return done()
    })
    .catch(e => done(new Error(e)))
  })

}

const createCard = (payload) => {
  return new Promise((resolve, reject) => {
    if (!payload.list_id) return reject('list_id is required')
    if (!payload.name) return reject('name is required')

    trello.post('/1/cards/', {
      idList: payload.list_id,
      name: payload.name,
      desc: payload.desc || ''
    }, (err, result) => {
      if (err) return reject(err)
      return resolve(result)
    })
  })
}
