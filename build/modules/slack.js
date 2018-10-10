'use strict';

var _exports = module.exports = {};
const axios = require('axios');

// Start a listener on the queue to process Job Events sent to the API for this module
_exports.listen = (Queue, appConfig) => {
  var queue = new Queue(appConfig.key, appConfig.redis);
  queue.process((job, done) => process(appConfig, job, done));
  return queue;
};

const process = (appConfig, job, done) => {
  let { action, payload } = job.data;
  switch (action.toString()) {
    case 'SEND_MESSAGE':
      return sendMessage(appConfig, payload, done);
    default:
      return done(new Error('Invalid action: ' + action));
  }
};

const sendMessage = (appConfig, payload, done) => {
  let { webhook, data } = payload;
  axios.post(webhook, data).then(result => {
    return done(null, result);
  }).catch(error => {
    return reject(new Error(error));
  });
};