import jwt from 'jsonwebtoken'

class Auth {
  secret_key: string | any
  secret_refresh_key: string | any
  
  constructor() {
    this.secret_key = process.env.JWT_SECRET_KEY
    this.secret_refresh_key = process.env.JWT_SECRET_KEY
  }

  private sign(payload: any, expiry: number | string, secret: string): string {
    const token = jwt.sign(
      {
        user: payload
      },
      secret,
      {
        expiresIn: expiry
      }
    )
    return token
  }

  public getAccessToken(payload: any): string {
    // temporary long live access token
    // const token = this.sign(payload, 60 * 60 * 24 * 6, this.secret_key)
    const token = this.sign(payload, 60 * 30, this.secret_key)
    return token
  }

  public getRefreshToken(payload: any): string {
    const token = this.sign(payload, '60d', this.secret_refresh_key)
    return token
  }

}

export default new Auth()