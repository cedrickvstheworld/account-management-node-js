import AccountModel from '../models/accounts'
import Queries from '../utils/queries'
import Auth from './auth'
import httpError from '../utils/httpError'
import * as responseConstants from '../utils/responseConstants'
import { createId } from '../utils/createId';
import { IActionBy } from '../interfaces/collections'
import { dataFilter } from '../utils/sharedFunctions'
import moment from 'moment'
import { user_types } from '../utils/constants';

export default class Account extends Auth {

  /**
   * signup
   */
  public signUp(firstName: string, lastName: string, email: string, mobileNo: string, role: number, addedBy: IActionBy, avatar: File) {
    return new Promise(async (resolve, reject) => {
      try {
        // check if email already exists
        const checkEmailIfExist = await AccountModel.findOne({'email.value': email})
        if (checkEmailIfExist) {
          return reject(new httpError(responseConstants.BAD_REQUEST_SIGN_UP, 'email is already registered'))
        }
        // created data
        const currentDate = Date.now()
        let data = createId({
          firstName,
          lastName,
          email: {
            value: email,
            isVerified: false
          },
          mobileNo,
          role,
          addedBy,
          createdAt: currentDate,
          updatedAt: currentDate
        })
        // upload avatar
        if (avatar) {
          // upload image and get s3path
          const s3Path =  `kyoo-admin/accounts/${data._id}/avatar`
          const fileUpload = await this.queries.upload(s3Path, avatar)
          // @ts-ignore
          data.avatarUrl = fileUpload.imageUrl
        }
        // register user
        let user = new AccountModel(data)
        const saved = await user.save()
        // send account verification
        this.sendEmailVerification(saved._id)
        resolve(saved)
      }
      catch (error) {
        console.log('ADD ACCOUNT ERROR:', error)
        reject(error)
      }
    })
  }

  /**
   * get user details by ID
   */
  public getAccountDetails(accoutId: string) {
    return AccountModel.findOne({_id: accoutId}).select('-password')
  }

  /**
   * search accounts
   */
  public searchAccounts(userRole: string, status: string, searchText: string, orderBy: string = '', order: number = 1, offset: number = 0, limit: number = 0) {
    return new Promise((resolve, reject) => {
      AccountModel.find(Object.assign(
        {},
        userRole !== 'show-all' ? {roleLevel: JSON.parse(userRole)} : {},
        status !== 'show-all' ? {isSuspended: !(JSON.parse(status))} : {}
      ))
      .then(async (accounts) => {
        const _accounts = accounts.map((account) => {
          let {firstName, lastName, email, roleLevel, isSuspended, addedBy, createdAt, lastSignedIn, _id} = account
          return {
            _id,
            name: `${firstName} ${lastName}`,
            email: `${email.value}`,
            lastLogin: `${moment(lastSignedIn).format('L')}-${moment(lastSignedIn).format('LT')}`,
            userRole: user_types[roleLevel],
            status: isSuspended ? 'SUSPENDED' : 'ACTIVE',
            addedBy: `${addedBy.name}`,
            dateAdded: moment(createdAt).format('L')
          }
        })
        const _order = order !== 1 ? 'DESC' : 'ASC'
        const filtered = await dataFilter(
          _accounts,
          searchText,
          orderBy,
          _order,
          offset,
          limit,
          ['name', 'email', 'lastLogin', 'userRole', 'status', 'addedBy', 'dateAdded']
        )
        resolve(filtered)
      })
      .catch((error) => {
        console.log('SEARCH ACCOUNT ERROR', error)
        reject(error)
      })
    })
  }

  /**
   * suspend/unsuspend user account
   */
  public changeAccountStatus(accountId: string, isSuspended: boolean) {
    return new Promise((resolve, reject) => {
      AccountModel.findOne({_id: accountId})
      .select('-password')
      .then(async (user) => {
        if (!user) {
          return reject(new httpError(responseConstants.BAD_REQUEST_FIND_ACCOUNT, 'account not found'))
        }
        if (isSuspended) {
          user.isSuspended = true
        }
        else {
          user.isSuspended = false
        }
        const updatedUser = await user.save()
        resolve(updatedUser)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  /**
   * edit account
   */
  public editAccount(accountId: string, firstName: string, lastName: string, email: string, mobileNo: string, roleLevel: number = 0, avatar: File) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await AccountModel.findOne({_id: accountId}).select('-password')
        if (!user) {
          return reject(new httpError(responseConstants.BAD_REQUEST_UPDATE_ACCOUNT, 'account not found'))
        }
        user.firstName = firstName
        user.lastName = lastName
        // check if email will be changed
        let sendEmailVerification = false
        if (user.email.value !== email) {
          // check if new email is in use by another account
          const checkEmailIfExist = await AccountModel.findOne({
            _id: {$ne: accountId},
            "email.value": email
          })
          if (checkEmailIfExist) {
            return reject(new httpError(responseConstants.BAD_REQUEST_UPDATE_ACCOUNT, 'email is in use by another account'))
          }
          user.email = {
            value: email,
            isVerified: false
          }
          sendEmailVerification = true
        }
        user.mobileNo = mobileNo
        user.roleLevel = roleLevel
        user.updatedAt = Date.now()
        // upload avatar
        if (avatar) {
          // upload image and get s3path
          const s3Path =  `kyoo-admin/accounts/${accountId}/avatar`
          const fileUpload = await this.queries.upload(s3Path, avatar)
          // @ts-ignore
          user.avatarUrl = fileUpload.imageUrl
        }
        const updatedUser = (await user.save()).toObject()
        // send email verification here if email was changed
        updatedUser.sendEmailVerification = false
        if (sendEmailVerification) {
          updatedUser.sendEmailVerification = true
          await this.sendChangeEmailVerification(accountId)
          .then(() => {
            updatedUser.sendEmailSuccess = true
          })
          .catch(() => {
            updatedUser.sendEmailSuccess = false
          })
        }
        resolve(updatedUser)
      }
      catch (error) {
        console.log('EDIT ACCOUNT ERROR:', error)
        reject(error)
      }
    })
  }
}