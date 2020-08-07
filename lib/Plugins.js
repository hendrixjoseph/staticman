'use strict'

const errorHandler = require('./ErrorHandler')

var requireHttps = (website) => {
  if (website.startsWith('https')) {
    return Promise.resolve(website)
  } else {
    return Promise.reject(errorHandler('Website URL must be https.'))
  }
}

var requireEnglish = (fields) => {
  const message = fields['message']

  const regex = /.*[A-z].*/
  const result = message.match(regex)

  const regex2 = /.*[A-z]{10}.*/
  const result2 = message.match(regex2)

  if (result != null || (result2 != null && message.length > 10)) {
    return Promise.resolve(fields)
  } else {
    return Promise.reject(errorHandler('No latin letters detected.'))
  }
}

var banUrls = (website) => {
  if (website.startsWith('https://cutt.us/freeass')) {
    return Promise.reject(errorHandler('Banned domain.'))
  } else {
    return Promise.resolve(website)
  }
}

var processWebsite = (fields) => {
  const website = fields['url']

  if (!website) return Promise.resolve(fields)

  return requireHttps(website)
            .then(() => banUrls(website))
            .then(() => Promise.resolve(fields))
            .catch(err => Promise.reject(err))
}

exports.processEntry = (fields) => {
  return requireEnglish(fields)
            .then(() => processWebsite(fields))
}
