export const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validNumber = /^(9)+[0-9]{9}$/

export const validLandline = /^(\()[0-9]{2}(\))(\s?)([0-9]{3,4})(-)([0-9]{3,4})$/

export const validFbLink = /^((((https:\/\/)?)+(www\.|m\.)?)?)+((facebook\.com\/)|(facebook.com\/)|(fb.com\/))[a-zA-Z0-9.?=&]+$/

export const validInstagramLink = /^((https:\/\/+(www\.)?)?)+(instagram\.com\/)[a-zA-Z0-9.?=&]+$/

export const validUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

export const validImages = /((JPEG)|(JPG)|(PNG)|(GIF)|(BMP)|(TIFF))/i

export const validVideos = /((MP4)|(WEBM)|(OGG))/i

export const validPassword = /^(?=.*?[0-9])(?=.*?[A-Z]).{6,}$/

export const humanName = /^[a-zA-zñ]+([a-zA-zñ. -])+$/

export const isBool = /^(true|false)$/