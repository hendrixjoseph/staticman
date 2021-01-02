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

  const english = message.match(/[ -~]/g)

  const numberOfCharacters = english ? english.length : 0

  let percent = numberOfCharacters / message.length

  if (percent > 0.9) {
    return Promise.resolve(fields)
  } else {
    return Promise.reject(errorHandler('english only'))
  }
}

var banUrls = (website, siteConfig) => {
  const banned = siteConfig.get('bannedDomains')

  let isBanned = banned.some(url => website.startsWith(url))

  if (isBanned) {
    return Promise.reject(errorHandler('Banned domain.'))
  } else {
    return Promise.resolve(website)
  }
}

var processWebsite = (fields, siteConfig) => {
  const website = fields['url']

  if (!website) return Promise.resolve(fields)

  return requireHttps(website)
            .then(() => banUrls(website, siteConfig))
            .then(() => Promise.resolve(fields))
            .catch(err => Promise.reject(err))
}

exports.processEntry = (fields, siteConfig) => {
  return requireEnglish(fields).then(() => processWebsite(fields, siteConfig))
}
