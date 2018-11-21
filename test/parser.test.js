const supertest = require('supertest')

const getParam = require('../lib')
const sampleApp = require('./sampleApp')

describe('parser usage', () => {
  test('should get string value', (done) => {
    sampleApp.get('/route', getParam('test'), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route?test=3')
      .expect(200)
      .expect({ test: '3' })
      .end(done)
  })
  test('should get integer value ', (done) => {
    sampleApp.get('/route1', getParam('test', { parser: getParam.INTEGER }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route1?test=3')
      .expect(200)
      .expect({ test: 3 })
      .end(done)
  })
  test('should get array value ', (done) => {
    sampleApp.get('/route2', getParam('test', { parser: getParam.ARRAY }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route2?test=a,b,c')
      .expect(200)
      .expect({ test: ['a', 'b', 'c'] })
      .end(done)
  })
  test('should be able to use custom parser', (done) => {
    sampleApp.get('/route3', getParam('test', { parser: (v) => (parseInt(v, 10) * 100) }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route3?test=5.2')
      .expect(200)
      .expect({ test: 500 })
      .end(done)
  })
  test('should response empty if parse error', (done) => {
    sampleApp.get('/route4', getParam('test', {
      parser: getParam.INTEGER
    }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route4?test=string')
      .expect(200)
      .expect({})
      .end(done)
  })
})
