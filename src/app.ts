/* Code Style Guide ****PEP8**** */

/**
 * ** NOTE ** add .env on gitignore
 */
// load .env file immediately
require("dotenv").config({ path: `${__dirname}/../.env` })

/**
 * imports
 */
// Modules/Libs/Frameworks
import express from "express"
import mongoose from "mongoose"
import morgan from 'morgan'
import {createClient} from 'redis'
import passport from 'passport'
const fingerprint = require('express-fingerprint')

/**
 * routers
 */
import accountsRouter from './urls/accounts'
import authRouter from './urls/auth'

/**
 * Types
 */
import { Response, Request, Application,  NextFunction} from 'express'

/**
 * App class wrapper
 */
class Main {
  // type declarations
  private app: Application
  private port: string | number | any
  private dbUrlString: string | any
  private redisPublisher: any

  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.dbUrlString = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
    this.appConfig()
  }

  // listen to port
  public listen() {
    this.app.listen(this.port, (): void => {
      console.log(`*** Server is listening on port ${this.port}`)
    })
  }

  // Redis Init and Config
  private loadRedisConfig() {
    this.redisPublisher = createClient(`redis://${process.env.REDIS_HOST}`)
    this.app.set("redisPublisher", this.redisPublisher)
    this.redisPublisher.on('error', (error: Error) => {
      console.log(`Server connection to redis failed. Connection String redis://${process.env.REDIS_HOST}. Error ${error}`)
    })
    this.redisPublisher.on('connect', () => {
      console.log(`*** Server is connected to redis. Connection String: redis://${process.env.REDIS_HOST}`)
    })
  }

  // initialize connection to mongodb
  private connectToDatabase() {
    // mongodb configs
    mongoose.set("useUnifiedTopology", true)
    mongoose.set("useFindAndModify", false)
    mongoose.set("useCreateIndex", true)
    mongoose.set("useNewUrlParser", true)
    // connect
    mongoose
      .connect(this.dbUrlString)
      .then((): void => {
        console.log(
          `*** Server is connected to database. Connection String: ${this.dbUrlString}`
        )
      })
      .catch((error: string): void => {
        console.log(
          `*** Server connection to the database failed. Connection String: ${this.dbUrlString}. Error: ${error}`
        )
      })
  }

  // initialize routes
  private loadRouters() {
    this.app.use('/accounts', accountsRouter)
    this.app.use('/auth', authRouter)
  }

  // initialize server configurations
  private appConfig() {
    this.app.use(morgan("dev"))
    // check if request.body has valid JSON object
    // (remove this if you will work with multipart forms or other file formats such as xml, etc)
    this.app.use(
      express.json({
        verify: (request: Request, response: Response, buf: any) => {
          try {
            JSON.parse(buf)
          } catch (e) {
            response
              .status(400)
              .json({ error: "request body has invalid JSON object" })
            throw Error("invalid JSON")
          }
        }
      })
    )
    // restrict headers contents and methods
    // allowed all for development
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      response.header("Access-Control-Allow-Origin", "*")
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Authorization, Content-Type, Accept"
      )
      response.setHeader("Access-Control-Allow-Credentials", "true")
      if (request.method === "OPTIONS") {
        response.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, PATCH, DELETE"
        )
        return response.sendStatus(200)
      }
      next()
    })
    this.app.use(express.urlencoded({ extended: false }))
    // enable device fingerprinting
    this.app.use(fingerprint({
      parameters: [
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip
      ]
    }))
    this.app.use(passport.initialize())
    // require('./class/passport')
    this.connectToDatabase()
    this.loadRedisConfig()
    this.loadRouters()
    this.app.set('view engine', 'hbs')
  }

}


// create server instance
const main = new Main()
main.listen()
