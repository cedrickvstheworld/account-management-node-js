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

export const dataFilter = (data: Array<any>, searchText: string = '', orderBy: string = '', order: string = 'ASC', offset: number = 0, limit: number = 0) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(data)) {
      return reject('data must be an array')
    }
    // filter by searchText
    let filtered = data.filter((elem) => {
      const match = new RegExp(searchText, 'i')
      let keys = Object.keys(elem)
      for (let ii in keys) {
        if (match.test(elem[keys[ii]])) {
          return elem
        }
      }
    })
    const dataLength = filtered.length
    let ordered = filtered.sort(sortCompareObject(orderBy, order))
    let result = ordered
    if (limit && !offset) {
      result = ordered.splice(0, limit)
    }
    else if (!limit && offset) {
      result = ordered.splice(offset)
    }
    else if (limit && offset) {
      result = ordered.splice(offset, limit)
    }
    resolve({
      data: result,
      totalPages: !limit ? 1 : Math.ceil(dataLength / limit),
      totalCounts: dataLength
    })
  })
}

export const sortCompareObject = (key: string, order = 'ASC') => {
  return function compare(l: any, r: any) {
    if (!l.hasOwnProperty(key) || !r.hasOwnProperty(key)) {
      return 0
    }
    const lVal = typeof l[key] === 'string' ? l[key].toUpperCase() : l[key]
    const rVal = typeof r[key] === 'string' ? r[key].toUpperCase() : r[key]
    let evaluator = 0
    if (lVal > rVal) {
      evaluator = 1
    }
    else if (lVal < rVal) {
      evaluator = -1
    }
    return order === 'DESC' ? evaluator * -1 : evaluator
  }
}
