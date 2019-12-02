// libs
import {query} from 'express-validator'

// utils
import {genericValidationMiddleWare} from '../sharedFunctions'

// types
import { IRequestValidator } from '../../interfaces/collections';

export const searchValidator: IRequestValidator = {
  pipeline: [
    query('offset')
    .isNumeric()
    .withMessage('@requestQuery -> offset:number')
    .optional(),
    query('limit')
    .isNumeric()
    .withMessage('@requestQuery -> limit:number')
    .optional(),
    query('order')
    .matches(/^(1|-1)$/)
    .withMessage('@requestQuery -> order:1|-1')
    .optional()
  ],
  middleware: genericValidationMiddleWare
}

// check if year and month is valid in the request queuery
export const checkYearAndMonth: IRequestValidator = {
  pipeline: [
    query('month')
    .matches(/^(0|1|2|3|4|5|6|7|8|9|10|11)$/)
    .withMessage('month options : 0-11')
    .optional(),
    query('year')
    .matches(/^([0-9]{4})$/)
    .withMessage('year is invalid')
    .optional()
  ],
  middleware: genericValidationMiddleWare
}