import {Request, Response, NextFunction} from 'express'
import HttpStatus from 'http-status-codes'
import passport from 'passport'
import { IRequest } from '../interfaces/collections';
import httpError from '../utils/httpError';
import * as responseConstants from '../utils/responseConstants'
import * as regExp from '../utils/regularExpressions'
import Auth from '../class/auth'

/**
 * Router Class
 * @public
 */
class Router {
  private auth: Auth

  constructor() {
    this.auth = new Auth()
  }
  
  /**
   * ** ENDPOINT ** send email verification
   */
  public sendAccountEmailVerification = (request: Request, response: Response) => {
    const {accountId} = request.params
    this.auth.sendEmailVerification(accountId)
    .then(() => {
      response.sendStatus(HttpStatus.OK)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }
  
  /**
   * ** ENDPOINT **  verify token of account verification
   */
  public verifyAccountToken = (request: Request, response: Response) => {
    const {token} = request.query
    this.auth.verifyEmailToken(token)
    .then((reply) => {
      response.status(HttpStatus.OK).json(reply)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

  /**
   * ** ENDPOINT **  set account password
   */
  public setAccountPassword = (request: Request, response: Response) => {
    const {setPasswordToken, password} = request.body
    this.auth.setAccountPassword(setPasswordToken, password)
    .then((user) => {
      response.status(HttpStatus.OK).json(user)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

  /**
   * ** ENDPOINT ** verify change email token
   * this action verifies the email
   */
  public verifyChangeEmail = (request: Request, response: Response) => {
    const {token} = request.query
    this.auth.verifyChangeEmail(token)
    .then((reply) => {
      response.status(HttpStatus.OK).json(reply)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

  /**
   * ** ENDPOINT ** send email verification (change email)
   */
  public sendChangeEmailVerification = (request: Request, response: Response) => {
    const {accountId} = request.params
    this.auth.sendChangeEmailVerification(accountId)
    .then(() => {
      response.sendStatus(HttpStatus.OK)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

  /**
   * ** ENDPOINT **  local-sign-in strategy
   */
  public signIn = (request: Request, response: Response, next: NextFunction) => {
    passport.authenticate('local-signin', {session: false}, async (error, user, info) => {
      if (!info) {
        return response.status(HttpStatus.UNAUTHORIZED).json(error)
      }
      request.logIn(user, (error) => {
        if (error) {
          console.log('REQUEST LOGIN ERROR: ', error)
        }
      })
      return response.status(HttpStatus.OK).json(user)
    })(request, response, next)
  }

  /**
   * ** ENDPOINT **  refresh access token
   */
  public refreshAccessToken = (request: Request, response: Response) => {
    // @ts-ignore
    let {hash=''} = request.fingerprint
    let {refreshToken} = request.body
    this.auth.refreshAccessToken(refreshToken, hash)
    .then((user) => {
      response.status(HttpStatus.OK).json(user)
    })
    .catch(() => {
      response.sendStatus(HttpStatus.UNAUTHORIZED)
    })
  }

  /**
   * ** ENDPOINT **  authorization
   */
  public authorize = (request: Request, response: Response) => {
    let token
    try {
      // @ts-ignore
      token = (request.headers.authorization.split(' '))[1]
    }
    catch (error) {
      return response.sendStatus(HttpStatus.UNAUTHORIZED)
    }
    // @ts-ignore
    let {hash=''} = request.fingerprint
    this.auth.verifyToken(token, hash)
    .then((user) => {
      response.setHeader('user', JSON.stringify(user))
      response.status(HttpStatus.OK).json(user)
    })
    .catch(() => {
      response.sendStatus(HttpStatus.UNAUTHORIZED)
    })
  }

}

export default new Router()
