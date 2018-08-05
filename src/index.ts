import * as express from 'express'
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.example" }) // Use this file as a baseline for your own environment
const ExpressApp: express.Application = express()
const REDIS_HOST: string = process.env.REDIS_HOST || '127.0.0.1'
const EXPRESS_PORT: number = +(process.env.PORT || 3000)
const KUE_PORT: number = +(process.env.PORT || 3001)

ExpressApp.listen(EXPRESS_PORT, () => {
  console.log('Kue interface on localhost:' + EXPRESS_PORT + '/kue/')
  console.log('Kue JSON API on localhost:' + EXPRESS_PORT + '/api/')
  console.log('Kue Instance on localhost:' + KUE_PORT)
})
