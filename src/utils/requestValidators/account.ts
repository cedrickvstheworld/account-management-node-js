// libs
import {body} from 'express-validator'

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
    .withMessage('@requestBody -> fullName: must be a valid number (e.g. 9280724566)')
    .optional(),
    body('role')
    .isIn([USER_TYPES.ADMIN.toString()])
    .withMessage('@requestBody -> role: 0: admin')
  ],
  middleware: genericValidationMiddleWare
}
