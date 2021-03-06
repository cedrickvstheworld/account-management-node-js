import S3 from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'
import fs from 'fs'
import {uploadFiles} from '../interfaces/collections'
class Uploader {
  private BucketName: string
  private s3Uploader: any
  private s3Sdk: any
  // @ts-ignore
  constructor (bucketName:string = process.env.S3_BUCKET_NAME) {
    this.BucketName = bucketName
    this._init()
  }
  _init () {
    const awsConfig = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_KEY_ID || '',
      Bucket: this.BucketName
    }
    this.s3Sdk = new AWS.S3(awsConfig)
    this.s3Uploader = new S3(awsConfig)
  }
  setBucketName (bucketName: string) {
    this.BucketName = bucketName
    this._init()
    return this.BucketName 
  }
  upload (filepath: string, avatar: uploadFiles, ACL: string = 'public-read') {
    const fileLoc = `${filepath}/${avatar.originalFilename}`
    const stream = fs.createReadStream(avatar.path)
    const obj = {
      Bucket: this.BucketName,
      Key: fileLoc,
      Body: stream,
      ContentType: avatar.type,
      ACL
    }
    return new Promise((resolve, reject) => {
      this.s3Uploader.upload(obj, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          const {Location: imageUrl = ''} = data
          resolve({
            avatarUrl: imageUrl,
            fileName: avatar.originalFilename,
            imageUrl: imageUrl
          })
        }
        fs.unlink(avatar.path, (err: any) => {
          if (err) console.log('err: ', err)
        })
      })
    })
  }
  multiUpload (filepath: string, files: uploadFiles[], ACL: string = 'public-read') {
    const obj = files.map(image => this.upload(filepath, image, ACL))
    return Promise.all(obj)
  }
  public deleteFile(file: string) {
    return new Promise((resolve,  reject) => {
      const params = {Bucket: this.BucketName, Key: file}
      this.s3Sdk.deleteObject(params, (error: any, data: any) => {
        if (error) {
          console.log(error)
          reject(error)
        }
        resolve(data)
      })
    })
  }
}

export default Uploader