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

export const setPassword: IRequestValidator = {
  pipeline: [
    body('password')
    .matches(regExp.validPassword)
    .withMessage('@requestBody -> password: must pass this /^(?=.*?[0-9])(?=.*?[A-Z]).{6,}$/g to be valid'),
    body('setPasswordToken')
    .isString()
    .withMessage('@requestBody -> setPasswordToken: must be a string')
  ],
  middleware: genericValidationMiddleWare
}

export const localSignUpFieldsComplete: IRequestValidator = {
  pipeline: [
    body('username').not().isEmpty(),
    body('password').not().isEmpty()
  ],
  middleware: genericValidationMiddleWare
}