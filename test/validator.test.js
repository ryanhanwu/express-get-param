const supertest = require('supertest')

const getParam = require('../lib')

const sampleApp = require('./sampleApp')

describe('validator usage', () => {
  test('should validate if its not null', (done) => {
    sampleApp.get('/route', getParam('test', { validator: (v) => !!v }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route')
      .expect(400)
      .end(done)
  })
  test('should parse and validate parameter', (done) => {
    sampleApp.get('/route1', getParam('test', {
      parser: getParam.INTEGER,
      validator: (v) => { return v >= 10 }
    }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route1?test=10.02')
      .expect(200)
      .expect({ test: 10 })
      .end(done)
  })

  test('should response validationError', (done) => {
    sampleApp.get('/route2', getParam('test', {
      parser: getParam.INTEGER,
      validator: (v) => {
        return v >= 10
      },
      validationError: (error) => {
        error.status = 415
        return error
      }
    }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route2?test=5')
      .expect(415)
      .end(done)
  })
  test('should response the original expection even if the validator error', (done) => {
    sampleApp.get('/route3', getParam('test', {
      parser: getParam.INTEGER,
      validator: (v) => {
        throw new Error('Unexpected Error')
      }
    }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route3?test=wow')
      .expect(500)
      .end(done)
  })
  test('should response validationError even if the validator error', (done) => {
    sampleApp.get('/route4', getParam('test', {
      parser: getParam.INTEGER,
      validator: (v) => {
        throw new Error('Unexpected Error')
      },
      validationError: (error) => {
        error.status = 503
        return error
      }
    }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route4?test=wow')
      .expect(503)
      .end(done)
  })
})
