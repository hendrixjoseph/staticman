const config = require('./../../../config')
const errorHandler = require('./../../../lib/ErrorHandler')
const frontMatter = require('front-matter')
const moment = require('moment')
const mockHelpers = require('./../../helpers')
const slugify = require('slug')
const yaml = require('js-yaml')
const User = require('../../../lib/models/User')

let mockConfig
let mockParameters

beforeEach(() => {
  mockConfig = mockHelpers.getConfig()
  mockParameters = mockHelpers.getParameters()

  jest.resetModules()
  jest.unmock('./../../../lib/SubscriptionsManager')
  jest.unmock('node-rsa')
})

describe('Staticman plugins', () => {
  describe('require https', () => {
    test('url is https - pass', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()

      return staticman._plugins.processEntry(data).then(extendedData => {
        expect(extendedData).toEqual(data)
      })
    })

    test('url is http - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.url = 'http://www.example.com'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'Website URL must be https.'
        })
      })
    })

    test('url is blank - pass', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.url = ''

      return staticman._plugins.processEntry(data).then(extendedData => {
        expect(extendedData).toEqual(data)
      })
    })

    test('url is null - pass', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.url = null

      return staticman._plugins.processEntry(data).then(extendedData => {
        expect(extendedData).toEqual(data)
      })
    })

    test('url is not present - pass', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      delete data.url

      return staticman._plugins.processEntry(data).then(extendedData => {
        expect(extendedData).toEqual(data)
      })
    })
  })

  describe('require english', () => {
	test('message has latin characters - pass', () => {
	  const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()

      return staticman._plugins.processEntry(data).then(extendedData => {
        expect(extendedData).toEqual(data)
      })
	})

	test('message is only numbers - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = '1234567890'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'No latin letters detected.'
        })
      })
    })

    test('message has non english letters - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = 'これは英語ではありません'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'No latin letters detected.'
        })
      })
    })
  })
})