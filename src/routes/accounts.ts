import {Request, Response, NextFunction} from 'express'
import HttpStatus from 'http-status-codes'
import passport from 'passport'
import { IRequest } from '../interfaces/collections';
import httpError from '../utils/httpError';
import * as responseConstants from '../utils/responseConstants'
import * as regExp from '../utils/regularExpressions'
import Account from '../class/account'
import { actionBy } from '../utils/sharedFunctions';

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
  public signUp = (request: IRequest, response: Response) => {
    // @ts-ignore
    let {hash=''} = request.fingerprint
    let {firstName, lastName, email, mobileNo, role} = request.body
    let avatar
    if (request.files) {
      avatar = request.files.avatar
    }
    let user = JSON.parse(request.headers.user) || {}
    this.account.signUp(firstName, lastName, email, mobileNo, parseInt(role), actionBy(user), avatar)
    .then(user => {
      response.status(HttpStatus.CREATED).json(user)
    })
    .catch(error => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

  /**
   * ** ENDPOINT ** get account details by ID
   */
  public getAccountDetails = (request: Request, response: Response) => {
    let {accountId} = request.params
    this.account.getAccountDetails(accountId)
    .then((account) => {
      if (!account) {
        return response.status(HttpStatus.NOT_FOUND)
        .json(new httpError(responseConstants.BAD_REQUEST_FIND_ACCOUNT, 'account does not exists'))
      }
      response.status(HttpStatus.OK).json(account)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

  /**
   * ** ENDPOINT **  account device logout
   */
  public logout = (request: Request, response: Response) => {
    // @ts-ignore
    let {hash=''} = request.fingerprint
    const {accountId} = request.params
    this.account.logout(hash, accountId)
    .then(() => {
      response.sendStatus(HttpStatus.OK)
    })
    .catch((error) => {
      response.status(HttpStatus.BAD_REQUEST).json(error)
    })
  }

}

export default new Router()
