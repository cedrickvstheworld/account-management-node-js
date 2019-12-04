// libs
import {validationResult} from 'express-validator'
import HttpStatus from 'http-status-codes'
import bcrypt from 'bcrypt'

// types
import {Request, Response, NextFunction} from 'express'
import { IAccount, IAccountModel } from '../interfaces/models/account';
import { IActionBy } from '../interfaces/collections';

// check Modules/Settings
export const validateModules = (modules: Array<number | any>, moduleConstants: Array<any>): boolean => {
  if (modules.length === 0) {
    return true
  }
  let validOptions = []
  for (let ii in moduleConstants) {
    validOptions.push(moduleConstants[ii].key)
  }
  // prevents duplication of array elements
  let checkerArray: Array<number> = []
  for (let i in modules) {
    if (checkerArray.indexOf(modules[i]) !== -1) {
      return false
    }
    checkerArray.push(modules[i])
    if (validOptions.indexOf(modules[i]) === -1) {
      return false
    }
  }
  return true
}


/**
 * general middleware function
 */
export const genericValidationMiddleWare = (request: Request, response: Response, next: NextFunction) => {
  let result: any = validationResult(request)
  if (result.errors.length !== 0) {
    return response.status(HttpStatus.BAD_REQUEST)
    .json(result)
  }
  next()
}

/**
 * bcrypt functions
 */
export const Bcrypt = {
  hash: (str: string): string => {
    return bcrypt.hashSync(str, 7)
  },
  compare: (plain: string, hashed: string): boolean => {
    return bcrypt.compareSync(plain, hashed)
  }
}

export const createVCode = (): string => {
  return (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString()
}

export const actionBy = (user: IAccountModel): IActionBy => {
  let actionBy = {
    _id: '',
    name: '',
    avatarUrl: '',
    roleLevel: 0
  }
  try {
    const {_id, firstName, lastName, avatarUrl, roleLevel} = user
    actionBy._id = _id
    actionBy.name = `${firstName} ${lastName}`
    actionBy.avatarUrl = avatarUrl
    actionBy.roleLevel = roleLevel
  }
  catch (error) {
    console.log('CONSTRUCT ACTION BY ERROR', error)
  }
  return actionBy
}
