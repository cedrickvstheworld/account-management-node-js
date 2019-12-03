import {Request} from 'express'

export interface IResponseError {
  error: string
  statusCode: number
  source?: string
}

export interface IRequestValidator {
  pipeline: Array<any>,
  middleware: Function
}

export interface IMailOptions {
  from?: string
  to?: string
  subject?: string
  text?: string
  html?: string
}

interface IAuth {
  user?: string
  pass?: string
}

export interface ITransportConfig {
  host: string
  port: number
  secure: boolean
  auth: IAuth
}

export interface IRequest extends Request {
  files: any
}

export interface UploadedImage {
  avatarUrl?: string
  fileName?: string
  imageUrl?: string
}

export interface uploadFiles {
  fieldName: string
  originalFilename: string
  path: string
  headers: object
  type: string
  fileName?: string
  size: number
}