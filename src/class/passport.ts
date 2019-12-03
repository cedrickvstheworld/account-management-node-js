import passport from 'passport'
const LocalStrategy = require('passport-local').Strategy; 
import AccountModel from '../models/accounts'
import {Request} from 'express'
import httpError from '../utils/httpError'
import * as responseConstants from '../utils/responseConstants'
import {Bcrypt} from '../utils/sharedFunctions'
import * as regExp from '../utils/regularExpressions'
import Auth from './auth'
import Jwt from './jwt'
const auth: Auth = new Auth()

passport.serializeUser(function (user: any, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  AccountModel.findById({
    _id: id
  }, (user) => {
    done(user)
  })
});

// user sign-in strategy (local)
passport.use('local-signin', new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
  (request: Request, username: string, password: string, done: any) => {
    AccountModel.findOne({'email.value': username})
    .then(async (user) => {
      if (!user) {
        return done(new httpError(responseConstants.AUTHENTICATION_ERROR, 'user not found'), false)
      }
      if (!user.email.isVerified) {
        return done(new httpError(responseConstants.AUTHENTICATION_ERROR, 'verify your email first'), false)
      }
      // check if there is a password set
      if (!user.password) {
        return done(new httpError(responseConstants.AUTHENTICATION_ERROR,
          'set a password first so you can login with your email locally. make sure that the email is also verified'), false)
      }
      if (!Bcrypt.compare(password, user.password)) {
        return done(new httpError(responseConstants.AUTHENTICATION_ERROR, 'incorrect password'), false)
      }
      // generate access-token for the user
      // get accessToken & refreshToken
      let userData = user.toObject()
      delete userData.password
      // @ts-ignore
      let {hash} = request.fingerprint
      await auth.syncAuthenticationToRedis(userData, hash)
      // update auth state
      const signedIn: any = await auth.updateAuthTag(userData._id)
      signedIn['accessToken'] = Jwt.getAccessToken(userData)
      signedIn['refreshToken'] = Jwt.getRefreshToken(userData)
      return done(null, signedIn, true)
    })
    .catch((error) => {
      console.log('MODEL ERROR', error)
      return done(error)
    })
  }
))


