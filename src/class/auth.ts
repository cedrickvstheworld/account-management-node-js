import AccountModel from '../models/accounts'
import Queries from '../utils/queries'
import httpError from '../utils/httpError'
import * as responseConstants from '../utils/responseConstants'
import {createClient, RedisClient} from 'redis'
import Jwt from './jwt'
import jwt from 'jsonwebtoken'
import Mailer from './mailer'

export default class Auth {
  public redisClient: RedisClient
  public queries: Queries
  private secret_key: string | any
  private secret_refresh_key: string | any

  constructor() {
    this.redisClient = createClient(`redis://${process.env.REDIS_HOST}`)
    this.queries = new Queries(AccountModel)
    this.secret_key = process.env.JWT_SECRET_KEY
    this.secret_refresh_key = process.env.JWT_SECRET_KEY
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
        const token =  jwt.sign({user: account._id}, this.secret_key, {expiresIn: '7d'})
        const verificationMail = `follow this link to complete email verification: ${process.env.SERVICE_HOST}/auth/verify-email/${token}`
        const mailer: Mailer =  new Mailer(account.email.value, 'Account Verification')
        mailer.accountVerification({
          link: verificationMail
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
   * verify email token
   */
  public verifyEmailToken(token: string) {
    return new Promise((resolve, reject) => {
      const payload = jwt.verify(token, this.secret_key)
      if (!payload) {
        return reject()
      }
      console.log(payload)
    })
  }

}