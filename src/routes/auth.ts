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

}

export default new Router()
