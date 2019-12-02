import {IDefaults, IAddedBy} from './defaults'
import {Document} from 'mongoose'


export interface IEmail {
  value: string
  isVerified: boolean
}

export interface IMobileNo extends IEmail {}

export interface IAccount {
  firstName: string
  lastName: string
  email: IEmail
  password: string
  mobileNo: string
  avatarUrl: string
  lastSignedIn: number
  isSignedIn: boolean
  isSuspended: boolean
  roleLevel: number
  addedBy: IAddedBy
}

export interface IAccountCollection extends IAccount, IDefaults {}
export interface IAccountModel extends IAccountCollection, Document {}