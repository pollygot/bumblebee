'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _exports = module.exports = {};
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

// Start a listener on the queue to process Job Events sent to the API for this module
_exports.listen = (Queue, appConfig) => {
  var queue = new Queue(appConfig.key, appConfig.queue);
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
  const tokens = payload.to.split(',') || [];
  const title = payload.title || '';
  const body = payload.body || '';
  const sound = payload.sound || 'default';
  const data = payload.data || {};
  let errors = [];
  let messages = tokens.filter(pushToken => {
    // validate tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      errors.push(`Push token ${pushToken} is not a valid Expo push token`);
      return false;
    } else return true;
  }).map(valid => ({ to: valid, sound, body, title, data }));

  // send the messages in batches
  let chunks = expo.chunkPushNotifications(messages);
  let responses = [];
  chunks.forEach((() => {
    var _ref = _asyncToGenerator(function* (chunk) {
      try {
        let { ticketChunk } = yield expo.sendPushNotificationsAsync(chunk);
        return responses.push(ticketChunk);
      } catch (error) {
        errors.push('error');
        return false;
      }
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })());
  return done(null, { responses, errors });
};