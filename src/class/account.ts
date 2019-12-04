import AccountModel from '../models/accounts'
import Queries from '../utils/queries'
import Auth from './auth'
import httpError from '../utils/httpError'
import * as responseConstants from '../utils/responseConstants'
import { createId } from '../utils/createId';
import { IActionBy } from '../interfaces/collections';

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

}