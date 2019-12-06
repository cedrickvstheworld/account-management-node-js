// libs
import {body, query} from 'express-validator'

// utils
import * as regExp from '../regularExpressions'
import {genericValidationMiddleWare} from '../sharedFunctions'
import * as generics from './generics'

// types
import { IRequestValidator } from '../../interfaces/collections';
import { USER_TYPES } from '../constants';

export const generic = generics

export const signUp: IRequestValidator = {
  pipeline: [
    body('firstName')
    .matches(regExp.humanName)
    .withMessage('@requestBody -> firstName: must be a valid human name'),
    body('lastName')
    .matches(regExp.humanName)
    .withMessage('@requestBody -> lastName: must be a valid human name'),
    body('email')
    .matches(regExp.validEmail)
    .withMessage('email must be valid'),
    body('mobileNo')
    .matches(regExp.validNumber)
    .withMessage('@requestBody -> mobileNo: must be a valid number (e.g. 9280724566)')
    .optional(),
    body('role')
    .isIn([USER_TYPES.ADMIN.toString()])
    .withMessage('@requestBody -> role: 0: admin')
  ],
  middleware: genericValidationMiddleWare
}

export const accountStatus: IRequestValidator = {
  pipeline: [
    body('isSuspended')
    .isBoolean()
    .withMessage('@requestBody -> isSuspended: boolean'),
  ],
  middleware: genericValidationMiddleWare
}

export const searchAccounts: IRequestValidator = {
  pipeline: [
    query('userRole')
    .matches(/(show-all)|(0)/)
    .optional(),
    query('status')
    .matches(/(show-all)|(true)|(false)/)
    .optional(),
  ],
  middleware: genericValidationMiddleWare
}

export const resetPassword: IRequestValidator = {
  pipeline: [
    body('oldPassword')
    .not()
    .isEmpty(),
    body('newPassword')
    .matches(regExp.validPassword)
    .withMessage('@requestBody -> newPassword: must pass this /^(?=.*?[0-9])(?=.*?[A-Z]).{6,}$/g to be valid'),
  ],
  middleware: genericValidationMiddleWare
}
