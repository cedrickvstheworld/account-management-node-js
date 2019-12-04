import {Request, Response, NextFunction} from 'express'
import HttpStatus from 'http-status-codes'
import passport from 'passport'
import { IRequest } from '../interfaces/collections';
import httpError from '../utils/httpError';
import * as responseConstants from '../utils/responseConstants'
import * as regExp from '../utils/regularExpressions'
import Account from '../class/account'

/**
 * Router Class
 * @public
 */
class Router {
  private account: Account

  constructor() {
    this.account = new Account()
  }

  /**
   * ** MIDDLEWARE ** validate file if Image
   */
  public validImage = (request: IRequest, response: Response, next: NextFunction) => {
    let avatar
    if (request.files) {
      avatar = request.files.avatar
    }
    if (avatar) {
      if (!regExp.validImages.test(avatar.type)) {
        return response.status(HttpStatus.BAD_REQUEST).json(new httpError(responseConstants.BAD_REQUEST_SIGN_UP,
          'avatar requires a valid image'))
      }
    }
    next()
  }

  /**
   * ** ENDPOINT ** local sign-up strategy
   */
  public signUp = (request: Request, response: Response) => {
    // @ts-ignore
    let {hash=''} = request.fingerprint
    let {avatar, firstName, lastName, email, mobileNo, role} = request.body
    this.account.signUp(firstName, lastName, email, mobileNo, parseInt(role), avatar)
    .then(user => {
      response.status(HttpStatus.CREATED).json(user)
    })
    .catch(error => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

  /**
   * account device logout
   */
  public logout = (request: Request, response: Response) => {
    // @ts-ignore
    let {hash=''} = request.fingerprint
    const {customerId} = request.params
    this.account.logout(hash, customerId)
    .then(() => {
      response.sendStatus(HttpStatus.OK)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

}

export default new Router()
