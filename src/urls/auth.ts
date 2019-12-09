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

     // user send change email verification
     this.router.post('/update-account/email-verification/:accountId', Router.sendChangeEmailVerification)

     // user verify email token and get set password token
     this.router.get('/update-account/verify-email', Router.verifyChangeEmail)

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

     // forgot password send email
     this.router.post('/forgot-password', Router.promptForgotPassword)

     // forgot password : check if verification code is valid
     this.router.get('/forgot-password/:token', Router.forgotPasswordCheckVerificationToken)

     // forgot password - web view
     this.router.get('/forgot-password/change-password/:token', Router.changePasswordWebView)

     // forgot password - change password
     this.router.post(
      '/forgot-password/change-password/:token',
      validator.forgotPassword.pipeline,
      validator.forgotPassword.middleware,
      Router.changePassword
    )

     // authorization
     this.router.get('/', Router.authorize)

     return this.router
   }

}

export default new Urls().expose()