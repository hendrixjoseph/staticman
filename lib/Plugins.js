'use strict'

const errorHandler = require('./ErrorHandler')

const requireHttps = (website) => {
  if (website.startsWith('https')) {
    return Promise.resolve()
  } else {
    return Promise.reject(errorHandler('Website URL must be https.'))
  }
}

const requireEnglish = (fields) => {
  const message = fields['message']

  const english = message.match(/[ -~]/g)

  const numberOfCharacters = english ? english.length : 0

  let percent = numberOfCharacters / message.length

  if (percent > 0.9) {
    return Promise.resolve()
  } else {
    return Promise.reject(errorHandler('english only'))
  }
}

const banUrls = (website, siteConfig) => {
  const banned = siteConfig.get('bannedDomains')

  let isBanned = banned.some(url => website.startsWith(url))

  if (isBanned) {
    return Promise.reject(errorHandler('Banned domain.'))
  } else {
    return Promise.resolve()
  }
}

const preventTooManyLinks = (fields) => {
  const message = fields['message']

  const count = message.match(/http/gi)

  if (count && count.length > 10) {
    return Promise.reject(errorHandler('Too many attempted links.'))
  } else {
    return Promise.resolve()
  }
}

const processWebsite = (fields, siteConfig) => {
  const website = fields['url']

  if (!website) return Promise.resolve(fields)

  return requireHttps(website)
            .then(() => banUrls(website, siteConfig))
            .then(() => preventTooManyLinks(fields))
            .then(() => Promise.resolve(fields))
            .catch(err => Promise.reject(err))
}

exports.processEntry = async (fields, siteConfig) => {
  await requireEnglish(fields)
  return await processWebsite(fields, siteConfig)
}
