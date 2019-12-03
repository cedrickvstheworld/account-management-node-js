import Router from '../routes/auth'
import express from 'express'

class Urls {
   // type declarations
   private router: any

   constructor() {
     this.router = express.Router({mergeParams: true})
   }
   
   public expose() {
     // customer SignUp
     this.router.post('/:accountId/email-verification', Router.sendAccountEmailVerification)
     this.router.get('/verify-email')
     
     return this.router
   }

}

export default new Urls().expose()