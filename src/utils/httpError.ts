import {IResponseError} from '../interfaces/collections'

export default class httpError extends Error {
  public statusCode: number
  public error: string
  public source?: string
  constructor (data: IResponseError, errMsg?: (string | null)) {
    super(`${data.statusCode} - ${data.error}. Source: ${errMsg || data.source}`)
    this.statusCode = data.statusCode
    this.error = data.error
    this.source = errMsg || data.source
  }
}
