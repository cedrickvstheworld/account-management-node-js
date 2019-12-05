import Router from '../routes/accounts'
import express from 'express'
import * as validator from '../utils/requestValidators/account'
const multipartMiddleware = require('connect-multiparty')()

class Urls {
   // type declarations
   private router: any

   constructor() {
     this.router = express.Router({mergeParams: true})
   }
   
   public expose() {

     // customer SignUp
     this.router.post(
       '/sign-up',
       multipartMiddleware,
       Router.validImage,
       validator.signUp.pipeline,
       validator.signUp.middleware,
       Router.signUp
     )

     // logout
     this.router.post('/logout/:accountId', Router.logout)

     // suspend/unsuspend user
     this.router.patch(
       '/status/:accountId',
       validator.accountStatus.pipeline,
       validator.accountStatus.middleware,
       Router.changeAccountStatus
     )

     // search accounts
     this.router.get('/search', Router.searchAccounts)

     // account details
     this.router.get('/:accountId', Router.getAccountDetails)

     return this.router
   }

}

export default new Urls().expose()