import AccountModel from '../models/accounts'
import Queries from '../utils/queries'
import httpError from '../utils/httpError'
import * as responseConstants from '../utils/responseConstants'
import {createClient, RedisClient} from 'redis'
import Jwt from './jwt'
import jwt from 'jsonwebtoken'
import Mailer from './mailer'
import * as emailImages from '../utils/email-images'
import { Bcrypt } from '../utils/sharedFunctions';

export default class Auth {
  public redisClient: RedisClient
  public queries: Queries
  private secret_key: string | any
  private secret_refresh_key: string | any
  private sign_up_secret: string | any
  private set_password_secret: string | any

  constructor() {
    this.redisClient = createClient(`redis://${process.env.REDIS_HOST}`)
    this.queries = new Queries(AccountModel)
    this.secret_key = process.env.JWT_SECRET_KEY
    this.secret_refresh_key = process.env.JWT_SECRET_KEY
    this.sign_up_secret = process.env.SIGN_UP_SECRET
    this.set_password_secret = process.env.SET_PASSWORD_SECRET
  }

  /**
   * send account verification link
   */
  public sendEmailVerification(accountId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await AccountModel.findOne({_id: accountId})
        if (!account) {
          return reject(new httpError(responseConstants.BAD_REQUEST_VERIFY_EMAIL, 'account does not exists'))
        }
        // email
        // create token
        const token =  jwt.sign({user: account._id}, this.sign_up_secret, {expiresIn: '7d'})
        const verificationLink = `${process.env.SERVICE_HOST}/auth/sign-up/verify-email?token=${token}`
        const mailer: Mailer =  new Mailer(account.email.value, 'Account Verification')
        mailer.accountVerification({
          button: {
            link: verificationLink,
            label: 'Verify Your Account'
          },
          content: `We're excited to have you get started. First You need to verify your account by clicking the button below.`,
          logo: emailImages.Logo,
          grayLogo: emailImages.GrayLogo

        })
        resolve()
      }
      catch (error) {
        console.log('SEND EMAIL VERIFICATION ERROR:', error)
        reject(error)
      }
    })
  }
  
  /**
   * verify email token (add account process)
   */
  public verifyEmailToken(token: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const payload: any = jwt.verify(token, this.sign_up_secret)
        if (!payload) {
          return reject(new httpError(responseConstants.BAD_REQUEST_SIGN_UP, 'Invalid Token'))
        }
        // look for account
        const id = payload.user
        const user = await AccountModel.findOne({_id: id})
        if (!user) {
          return reject(new httpError(responseConstants.BAD_REQUEST_SIGN_UP, 'User Not found'))
        }
        // create reset password token
        const setPasswordToken = jwt.sign({user: id}, this.set_password_secret, {expiresIn: 30 * 5})
        resolve({setPasswordToken})
      }
      catch (error) {
        console.log(error)
        reject(new httpError(responseConstants.BAD_REQUEST_SIGN_UP, 'Invalid Token'))
      }
    })
  }

  /**
   * set password upon email verification (add account process)
   */
  public setAccountPassword(token: string, password: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const payload: any = jwt.verify(token, this.set_password_secret)
        if (!payload) {
          return reject(new httpError(responseConstants.BAD_REQUEST_SIGN_UP, 'Invalid Token'))
        }
        // set password
        const id = payload.user
        const user = await AccountModel.findOneAndUpdate(
          {_id: id},
          {password: Bcrypt.hash(password), 'email.isVerified': true},
          {new: true}
        ).select('-password')
        resolve(user)
      }
      catch (error) {
        console.log('SET PASSWORD ERROR', error)
        reject(new httpError(responseConstants.BAD_REQUEST_SIGN_UP, 'Invalid Token'))
      }
    })
  }

  /**
   * sync user authentication to redis (userId, device fingerprints)
   * ** DEV NOTE **
   * When syncing tokens in redis, it should be like {accountId:  ["someDeviceFingerprint", "Another user device fingerprint"]}
   */
  public syncAuthenticationToRedis(payload: any, fingerprint: string = '') {
    return new Promise(async (resolve, reject) => {
      try {
        // check accountId already exists in redis
        let deviceFingerprints: Array<string> = [fingerprint]
        this.redisClient.get(payload._id, async (err, reply) => {
          // if already exists , update its value
          if (reply) {
            let value: Array<string> = JSON.parse(reply)
            value.push(fingerprint)
            // ensure that no element will repeat for efficiency
            value = [...new Set(value)]
            // update key's value
            await this.redisClient.getset(payload._id, JSON.stringify(value))
          }
          await this.redisClient.set(payload._id, JSON.stringify(deviceFingerprints))
          resolve()
        })
      }
      catch (error) {
        reject(error)
      }
    })
  }

  /**
   * verify tokens
   */
  public verifyToken(token: string, fingerprint: string) {
    return new Promise((resolve, reject) => {
      try {
        // step 1: check if token is valid
        // @ts-ignore
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!payload) {
          return reject()
        }
        // check redis auth validation
        this.redisClient.get(payload.user._id, async (err, reply) => {
          if (!reply) {
            return reject()
          }
          let validDevices: any = JSON.stringify(reply)
          if (validDevices.indexOf(fingerprint) === -1) {
            return reject()
          }
          return resolve(payload.user)
        })
      }
      catch (error) {
        return reject()
      }
    })
  }

  /**
   * refresh Access Token
   * generate new access Token if refresh Token is valid
   */
  public refreshAccessToken(refreshToken: string, fingerprint: string) {
    return new Promise((resolve, reject) => {
      this.verifyToken(refreshToken, fingerprint)
      .then((user: any) => {
        user['accessToken'] = Jwt.getAccessToken(user)
        user['refreshToken'] = refreshToken
        resolve(user)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  /**
   * update Auth Tag (isSignedIn?)
   */
  public async updateAuthTag(accountId: string) {
    return new Promise((resolve, reject) => {
      try {
        this.redisClient.get(accountId, async (err, reply) => {
          let isSignedIn = false
          if (reply) {
            let onDevice = JSON.parse(reply)
            if (onDevice.length > 0) {
              isSignedIn = true
            }
          }
          // update value in database
          let user: any = await AccountModel.findOneAndUpdate(
            {_id: accountId},
            Object.assign(
              {isSignedIn, updatedAt: Date.now()},
              isSignedIn ? {lastSignedIn: Date.now()} : {}
            ),
            {new: true}
          ).select('-password')
          return resolve(user.toObject())
        })
      }
      catch (error) {
        console.log(error)
      }
    })
  }

  /**
   * account Logout
   */
  public logout(fingerprint: string, accountId: string) {
    return new Promise((resolve, reject) => {
      try {
        this.redisClient.get(accountId, (err, reply) => {
          if (reply) {
            let authenticatedDevices = JSON.parse(reply).filter((hash: string) => {
              if (hash !== fingerprint) {
                return hash
              }
            })
            this.redisClient.getset(accountId, JSON.stringify(authenticatedDevices), async () => {
              await this.updateAuthTag(accountId)
            })
          }
        })
        resolve()
      }
      catch (error) {
        reject(error)
      }
    })
  }

}