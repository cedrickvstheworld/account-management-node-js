import {Schema, model} from 'mongoose'
import {IAccountModel} from '../interfaces/models/account'
import {defaults} from './defaults'
import { USER_TYPES } from '../utils/constants';


let account = {
  ...defaults,
  ...{
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    email: {
      value: {
        type: String,
        default: ''
      },
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    password: {
      type: String,
      default: ''
    },
    mobileNo: {
      type: String,
      default: ''
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    lastSignedIn: {
      type: Number,
      default: 0
    },
    isSignedIn: {
      type: Boolean,
      default: false
    },
    isSuspended: {
      type: Boolean,
      default: false
    },
    roleLevel: {
      type: Number,
      default: USER_TYPES.ADMIN
    },
    addedBy: {
      _id: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      avatarUrl: {
        type: String,
        default: ''
      },
      roleLevel: {
        type: Number,
        default: USER_TYPES.ADMIN
      }
    }
  }
}

const schema = new Schema(account)

export default model<IAccountModel>('account', schema)
