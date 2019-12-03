/**
 * imports
 */
// modules/libs/frameworks
import nodeMailer from 'nodemailer'
const hbs = require('nodemailer-express-handlebars')

// types
import {IMailOptions, ITransportConfig} from '../interfaces/collections'


/**
 * Emailer Class
 */
export default class sendEmail {
  // type declarations
  mailOptions: any
  transportConfig: ITransportConfig
  handlebarOptions: any

  constructor (email: string, subject: string) {
    this.mailOptions = {
      from: `${process.env.GMAIL_ACCOUNT_USER} KYOO`,
      to: email,
      subject
    }
    this.transportConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_ACCOUNT_USER,
        pass: process.env.GMAIL_ACCOUNT_PASSWORD
      }
    }
    this.handlebarOptions = {
      viewEngine: {
        extName: '.hbs',
        partialsDir: 'emails',
        layoutsDir: 'emails',
        defaultLayout: 'account-template.hbs',
      },
      viewPath: 'emails',
      extName: '.hbs'
    }
  }

  public async accountVerification(context: any) {
    return new Promise(async(resolve, reject) => {
      let transporter = nodeMailer.createTransport(this.transportConfig)
      transporter.use('compile', hbs(this.handlebarOptions))
      let info = await transporter.sendMail({
        ...this.mailOptions,
        ...{
          template: 'account-template',
          context,
        }
      })
      console.log(info)
      resolve()
    })
  }

}
