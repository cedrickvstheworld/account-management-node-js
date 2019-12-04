import Router from '../routes/auth'
import express from 'express'
import * as validator from '../utils/requestValidators/auth'

class Urls {
   // type declarations
   private router: any

   constructor() {
     this.router = express.Router({mergeParams: true})
   }
   
   public expose() {
     // user SignUp
     this.router.post('/sign-up/email-verification/:accountId', Router.sendAccountEmailVerification)

     // user verify email token and get set password token
     this.router.get('/sign-up/verify-email', Router.verifyAccountToken)

     // set account password (signup process)
     this.router.patch(
       '/sign-up/set-password',
       validator.setPassword.pipeline,
       validator.setPassword.middleware,
       Router.setAccountPassword
     )

     // local-sign-in 
     this.router.post(
       '/sign-in',
       validator.localSignUpFieldsComplete.pipeline,
       validator.localSignUpFieldsComplete.middleware,
       Router.signIn
     )

     // refresh access token
     this.router.patch('/refresh-token', Router.refreshAccessToken)

     // authorization
     this.router.get('/', Router.authorize)
     
     return this.router
   }

}

export default new Urls().expose()