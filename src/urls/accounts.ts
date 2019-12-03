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


    return this.router
   }

}

export default new Urls().expose()