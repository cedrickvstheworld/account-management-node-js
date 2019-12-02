// types
import {IResponseError} from '../interfaces/collections'

/**
 * Constants for Response Messages
 * @public
 */


/**
 * auth related responses
 */
export const BAD_REQUEST_SIGN_UP: IResponseError = {
  error: 'BAD_REQUEST_SIGN_UP',
  statusCode: 40404,
  source: ''
}

export const VERIFICATION_CODE_EXPIRED: IResponseError = {
  error: 'VERIFICATION_CODE_EXPIRED_SIGN_UP',
  statusCode: 404774,
  source: ''
}

export const VERIFICATION_CODE_INVALID: IResponseError = {
  error: 'VERIFICATION_CODE_INVALID_SIGN_UP',
  statusCode: 404776,
  source: ''
}

export const VERIFICATION_CODE_EXPIRED_FORGOT_PASSWORD: IResponseError = {
  error: 'VERIFICATION_CODE_EXPIRED_FORGOT_PASSWORD',
  statusCode: 404734,
  source: ''
}

export const VERIFICATION_CODE_INVALID_FORGOT_PASSWORD: IResponseError = {
  error: 'VERIFICATION_CODE_INVALID_FORGOT_PASSWORD',
  statusCode: 404736,
  source: ''
}

export const FORGOT_PASSWORD_SAME_PASSWORD: IResponseError = {
  error: 'FORGOT_PASSWORD_SAME_PASSWORD',
  statusCode: 422836,
  source: ''
}

export const BAD_REQUEST_VERIFY_EMAIL: IResponseError = {
  error: 'BAD_REQUEST_VERIFY_EMAIL',
  statusCode: 40207,
  source: ''
}

export const BAD_REQUEST_VERIFY_MOBILE_NUMBER: IResponseError = {
  error: 'BAD_REQUEST_VERIFY_MOBILE_NUMBER',
  statusCode: 40204,
  source: ''
}

export const AUTHENTICATION_ERROR: IResponseError = {
  error: 'AUTHENTICATION_ERROR',
  statusCode: 40401,
  source: ''
}

export const EMAIL_UNVERIFIED: IResponseError = {
  error: 'EMAIL_UNVERIFIED',
  statusCode: 69401,
  source: ''
}

export const LINK_FACEBOOK_FAILED: IResponseError = {
  error: 'LINK_FACEBOOK_FAILED',
  statusCode: 65400,
  source: ''
}

export const BAD_REQUEST_FIND_ACCOUNT: IResponseError = {
  error: 'BAD_REQUEST_FIND_ACCOUNT',
  statusCode: 65404,
  source: ''
}

export const BAD_REQUEST_UPDATE_ACCOUNT: IResponseError = {
  error: 'BAD_REQUEST_UPDATE_ACCOUNT',
  statusCode: 55404,
  source: ''
}

export const BAD_REQUEST_FORGOT_PASSWORD: IResponseError = {
  error: 'BAD_REQUEST_FORGOT_PASSWORD',
  statusCode: 45404,
  source: ''
}

export const BAD_REQUEST_CREATE_MESSAGE: IResponseError = {
  error: 'BAD_REQUEST_CREATE_MESSAGE',
  statusCode: 75404,
  source: ''
}

export const BAD_REQUEST_GET_MESSAGE: IResponseError = {
  error: 'BAD_REQUEST_GET_MESSAGE',
  statusCode: 43400,
  source: ''
}

export const BAD_REQUEST_DELETE_MESSAGE: IResponseError = {
  error: 'BAD_REQUEST_DELETE_MESSAGE',
  statusCode: 33400,
  source: ''
}

export const BAD_REQUEST_UPDATE_NOTIFICATION_SETTINGS: IResponseError = {
  error: 'BAD_REQUEST_UPDATE_NOTIFICATION_SETTINGS',
  statusCode: 57400,
  source: ''
}