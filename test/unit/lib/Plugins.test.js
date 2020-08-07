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
    
    test('short message has latin characters - pass', () => {
	  const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = 'Short'

      return staticman._plugins.processEntry(data).then(extendedData => {
        expect(extendedData).toEqual(data)
      })
	})
    
    test('long message has latin characters - pass', () => {
	  const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = 'Lorem ipsum dolor sit amet, ea suas reque mel! Pro eligendi salutatus an, facilis conceptam neglegentur ad vix. No has utamur scribentur, ad graecis molestiae mea. His ut propriae conceptam, id errem causae delicata ius? An diam consul praesent per. Purto definiebas vituperatoribus at per, per sonet democritum ei, mei id magna nullam pericula.'

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

    test('short message has non english letters - fail', () => {
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
    
    test('long message has Cyrillic letters - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = 'Лорем ипсум долор сит амет, те при ипсум солет промпта. Ех хабео еффициенди сеа. Ех солум дицтас молестие мел, иус лорем диссентиас ад? Велит еирмод вел еи? Поссит патриояуе мел ат, мелиоре яуалисяуе цу яуо. Дицо пробо цотидиеяуе нам ут, еам ад мунере лаборес. Some English.'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'No latin letters detected.'
        })
      })
    })
    
     test('long message has Greek letters - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = 'Λορεμ ιπσθμ δολορ σιτ αμετ, cθμ ιθστο ομνεσ σολετ θτ, εριπθιτ περφεcτο νεγλεγεντθρ vιμ αν? Ιδ σολεατ διcερετ εθμ, αδ δεβετ γραεcι εξπετενδα εαμ, εθ νθσqθαμ αδιπισcινγ εθμ. Vιμ ιν εσσε ταcιματεσ, μεα μοδο οπορτεατ τε! Ομνιθμ λαβοραμθσ vιμ εξ, vιξ ταλε ρεcθσαβο vιτθπερατα εα! Εξ αεqθε ηαρθμ πετεντιθμ vιμ, γραεcισ περcιπιτ cθμ εθ. Εστ qθανδο σεντεντιαε σιγνιφερθμqθε αν, απειριαν λαβοραμθσ περcιπιτθρ ιδ. Some English.'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'No latin letters detected.'
        })
      })
    })
    
    test('long message has Chinese letters - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = '告棋丈玲季各手均表刊座暴読季考疑明頭供。予禁毎著年売捕禁拳延蔵滞地問松政面経。災関興組者国村語景情成毎返能出稿人皆田金。育係日打逃員賀曽投昭貝政化田佐津暮施百江。摘得管毎報上禁笑作浮位馬子持勝朝能保袋。録文釈経細不談家集収階紙賀見禁図例。伝都友慶退紙出念局昔保半回信戦方負減同。明乗目同基意座房人要写志。 Some English.'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'No latin letters detected.'
        })
      })
    })
    
    test('long message has Japanese letters - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = '負じドン変56毎ア金条ッるきて投西送ムヤヨエ死必ねスづン協宅解タフ心公セナ女85圧渉ヘホヤカ道6高ヒヲ主有竹フ審転み段交なぜイ低置モ治短致哲わフすッ。姿よのけ障院6龍支ヒラル得展もせ料59派ホヱ支協ルきて重面レコフ質係ゃレ以味せ校論用乱タオ藤談ラさ夏旅タ次多チコ題技福推知てひづ。 Some English.'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'No latin letters detected.'
        })
      })
    })
    
    test('long message has Arabic letters - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.message = 'وفي قد جديدة الصين. أم كلّ الشتاء استبدال, عدد جديداً والنفيس بالسيطرة إذ. ذات لكون أخرى وإعلان بل, بين ميناء المارق الصفحة هو, عن بحق هناك واعتلاء. أن اعتداء حاملات عرض, تم لمّ أوراقهم الأوروبية. مارد والتي لها من, ذات هنا؟ التبرعات الأبرياء لم. Some English.'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'No latin letters detected.'
        })
      })
    })
  })

  describe('banned urls', () => {
      test('url "https://cutt.us/freeass" is banned - fail', () => {
      const Staticman = require('./../../../lib/Staticman')
      const staticman = new Staticman(mockParameters)

      mockConfig.set('transforms', undefined)
      staticman.siteConfig = mockConfig

      const data = mockHelpers.getFields()
      data.url = 'https://cutt.us/freeass'

      return staticman._plugins.processEntry(data).catch(err => {
        expect(err).toEqual({
          _smErrorCode: 'Banned domain.'
        })
      })
    })
  })
})