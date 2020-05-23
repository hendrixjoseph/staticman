
var requireHttps = function (fields) {
  const website = fields['url']

  if (!website) return Promise.resolve(fields)

  if (website.startsWith('https')) {
    return Promise.resolve(fields)
  } else {
    return Promise.reject(errorHandler('Website URL must be https.'))
  }
}

var requireEnglish = function (fields) {
	const message = fields['message']	
	const regex = /.*[A-z].*/;
	const result = message.match(pattern)
	
	if (result.length > 0) {
		return Promise.resolve(fields)
	} else {
		return Promise.reject(errorHandler('No latin letters detected.'))
	}
}

exports.processEntry = function(fields) {
	return requiresHttps(fields).then(() => requireEnglish(fields));
}