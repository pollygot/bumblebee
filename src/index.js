// IMPORTS
import * as dotenv from 'dotenv'
const Kue = require('kue')

// DECLARE CONFIG
dotenv.config({ path: '.example.env' }) // Use this file as a baseline for your own environment
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
const REDIS_PORT = +(process.env.REDIS_PORT || 6379)
const EXPRESS_PORT = +(process.env.PORT || 3000)

// Set up Kue
const Queue = Kue.createQueue({
  redis: { host: REDIS_HOST, port: REDIS_PORT }
})

// Expost the App
Kue.app.listen(EXPRESS_PORT)
console.log('Kue listening on localhost:' + EXPRESS_PORT)