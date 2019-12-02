
import http from 'request'
export default class SMS {
  send (recipient: string, message: string) {
    return new Promise((resolve, reject) => {
      // return resolve()
      http({
        url: 'https://ws-live.txtbox.com/v1/sms/push',
        method: 'POST',
        headers: {
          'X-TXTBOX-Auth': process.env.MULTISYS_TXTBOX_API_AUTH,
          'Content-Type': 'application/json'
        },
        json: {
          number: recipient,
          message
        }
      }, (err: Error, response : any) => {
        if (!err) {
          const {body} = response
          if (response.statusCode === 200) {
            console.log(response)
            resolve()
          } else {
            reject(body)
          }
        }
        return reject(err)
      })
    })
  }
}