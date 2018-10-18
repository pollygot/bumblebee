'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _exports = module.exports = {};
const axios = require('axios');

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

const sendMessage = (() => {
  var _ref = _asyncToGenerator(function* (appConfig, payload, done) {
    const SMS_URL = 'https://rest.nexmo.com/sms/json';
    let data = {
      api_key: appConfig.config.apiKey,
      api_secret: appConfig.config.apiSecret,
      to: payload.to,
      from: payload.from,
      text: payload.text
    };
    let { data: result } = yield axios.post(SMS_URL, data).catch(function (e) {
      return done(new Error(e));
    });
    return done(null, result);
  });

  return function sendMessage(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();