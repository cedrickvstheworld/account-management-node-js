import {Request, Response, NextFunction} from 'express'
import HttpStatus from 'http-status-codes'
import passport from 'passport'

/**
 * Router Class
 * @public
 */
class Router {

  constructor() {
  }

  /**
   * ** ENDPOINT ** local sign-up strategy
   */
  public signUp = (request: Request, response: Response) => {
    // @ts-ignore
    let {hash=''} = request.fingerprint
    let {fullName, mobileNo, password} = request.body
  }

}

export default new Router()
