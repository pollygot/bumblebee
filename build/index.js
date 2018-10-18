'use strict'

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments)
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg)
          var value = info.value
        } catch (error) {
          reject(error)
          return
        }
        if (info.done) {
          resolve(value)
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value)
            },
            function(err) {
              step('throw', err)
            }
          )
        }
      }
      return step('next')
    })
  }
}

const config = require('config')
const express = require('express')
const Queue = require('bull')
const constants = require('./lib/constants')
const { check, validationResult } = require('express-validator/check')

//
// GLOBAL CONFIG
// -------------------------------
//
const APP_DEFAULTS = constants.APPS
const REDIS_HOST = process.env.REDIS_HOST || config.get('REDIS').host
const REDIS_PORT = config.get('REDIS').port
const API_PORT = +(config.get('API.port') || 3000)
const CORS = config.get('API.cors') || false
const APPS = config.get('APPS').map(x => {
  let appDefaults = APP_DEFAULTS.find(app => x.type === app.type)
  return _extends({}, x, {
    actions: appDefaults.actions, // @TODO: allow the user to specify a subset of actions
  })
})

//
// Initialise queues
// -------------------------------
//
const facebook = require('./modules/facebook')
const mailgun = require('./modules/mailgun')
const nexmo = require('./modules/nexmo')
const slack = require('./modules/slack')
const trello = require('./modules/trello')
var allQueues = []
APPS.forEach(app => {
  let appConfig = _extends({}, app)
  if (!appConfig.queue)
    appConfig.queue = { redis: { host: REDIS_HOST, port: REDIS_PORT } }
  switch (app.type) {
    case 'FACEBOOK':
      console.log('Starting Facebook')
      allQueues.push(facebook.listen(Queue, appConfig))
      break
    case 'MAILGUN':
      console.log('Starting Mailgun')
      allQueues.push(mailgun.listen(Queue, appConfig))
      break
    case 'NEXMO':
      console.log('Starting Nexmo')
      allQueues.push(nexmo.listen(Queue, appConfig))
      break
    case 'SLACK':
      console.log('Starting Slack')
      allQueues.push(slack.listen(Queue, appConfig))
      break
    case 'TRELLO':
      console.log('Starting Trello')
      allQueues.push(trello.listen(Queue, appConfig))
      break
    default:
      break
  }
})

//
// Expose the API
// -------------------------------
//
const logger = (req, res, next) => {
  console.log('API: ', req.path)
  next()
}
const app = express()
app.use(express.json())
app.use(logger)
if (CORS) app.use(require('cors')())

// Get apps/app
app.get(
  '/v1/admin/apps/:appKey?',
  (() => {
    var _ref = _asyncToGenerator(function*(req, res) {
      let { appKey } = req.params
      if (appKey) {
        return res.json(app)
      } else {
        return res.json(APPS)
      }
    })

    return function(_x, _x2) {
      return _ref.apply(this, arguments)
    }
  })()
)

// Get jobs for one app
app.get(
  '/v1/apps/:appKey/jobs',
  (() => {
    var _ref2 = _asyncToGenerator(function*(req, res) {
      let { appKey } = req.params
      let q = allQueues.find(function(x) {
        return x.name === appKey
      })
      let active = yield q.getJobs('active')
      let completed = yield q.getJobs('completed')
      let failed = yield q.getJobs('failed')
      let delayed = yield q.getJobs('delayed')
      let waiting = yield q.getJobs('waiting')
      return res.json({
        active: active,
        completed: completed,
        failed: failed,
        delayed: delayed,
        waiting: waiting,
      })
    })

    return function(_x3, _x4) {
      return _ref2.apply(this, arguments)
    }
  })()
)

// Get jobs/job
app.get(
  '/v1/jobs/:id?',
  (() => {
    var _ref3 = _asyncToGenerator(function*(req, res) {
      let { id } = req.params
      let getAllJobs = allQueues.map(function(queue) {
        return queue.getJobs()
      })
      Promise.all(getAllJobs).then(function(jobs) {
        let flattened = jobs.reduce(function(acc, jobList) {
          return acc.concat(jobList)
        }, [])
        if (id) {
          let job = flattened.find(function(x) {
            return x.id.toString() === id.toString()
          })
          return res.json(job)
        } else {
          return res.json(flattened)
        }
      })
    })

    return function(_x5, _x6) {
      return _ref3.apply(this, arguments)
    }
  })()
)

// Create a new job
app.post(
  '/v1/jobs',
  [
    // validation
    check('appKey')
      .exists()
      .custom((value, { req }) => appExists(APPS, value))
      .withMessage(`App does't exist`),
    check('payload').exists(),
    check('action')
      .exists()
      .custom((value, { req }) => {
        if (!appExists(APPS, req.body.appKey)) return true
        // this app doesn't exist but we don't want to throw a false positive here
        else if (!req.body.payload) return true
        // payload doesn't exist but we don't want to throw a false positive here
        else {
          let { appKey, action, payload } = req.body
          let app = getApp(APPS, appKey)
          // does the app support this action?
          let appAction = getAppAction(app, action)
          if (!appAction)
            return Promise.reject(`This app doesn't support that action`)
          // did the user give all the required params?
          let missingParams = getMissingParams(appAction, payload)
          if (missingParams.length !== 0)
            return Promise.reject(
              `You're missing some params: ${missingParams.join()}`
            )
          // validation passed
          return true
        }
      }),
  ],
  (() => {
    var _ref4 = _asyncToGenerator(function*(req, res) {
      if (!validationResult(req).isEmpty())
        return res.status(422).json({ errors: validationResult(req).array() })
      const { appKey, action, payload, options } = req.body
      let queue = allQueues.find(function(x) {
        return x.name === appKey
      })
      let processingInfo = { payload: payload, action: action }
      let job = yield queue.add(processingInfo, options)
      return res.json({ id: job.id })
    })

    return function(_x7, _x8) {
      return _ref4.apply(this, arguments)
    }
  })()
)
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

app.listen(API_PORT, () => {
  console.log(`API listening on port ${API_PORT}`)
})

//
// Helpers
// ------------------
//
const appExists = (allApps, appKey) => {
  return allApps.some(x => x.key == appKey)
}
const getMissingParams = (action, payload) => {
  let requiredParams = action.params.filter(x => x.required)
  let paramsGiven = Object.keys(payload)
  console.log('paramsGiven', paramsGiven)
  let missing = []
  requiredParams.forEach(x => {
    if (!paramsGiven.includes(x.param)) missing.push(x.param)
  })
  return missing
}
const getApp = (allApps, appKey) => {
  return allApps.find(x => x.key == appKey) || null
}
const getAppAction = (app, action) => {
  return app.actions.find(x => x.action === action) || null
}
