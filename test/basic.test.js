const supertest = require('supertest')

const getParam = require('..')
const sampleApp = require('./sampleApp')

describe('basic middleware usage', () => {
  test('should get empty value ', (done) => {
    sampleApp.get('/route1', getParam('test'), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route1')
      .expect(200)
      .expect({})
      .end(done)
  })
  test('should get query string from url', (done) => {
    sampleApp.get('/route2', getParam('name'), getParam('type'), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route2?name=test&type=ci')
      .expect(200)
      .expect({ name: 'test', type: 'ci' })
      .end(done)
  })
  test('should get request param from url', (done) => {
    sampleApp.get('/route3/:name', getParam('name'), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .get('/route3/test')
      .expect(200)
      .expect({ name: 'test' })
      .end(done)
  })
  test('should get params from json body', (done) => { // application/json
    sampleApp.post('/route4', getParam('name'), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .post('/route4')
      .send({ name: 'test' })
      .expect(200)
      .expect({ name: 'test' })
      .end(done)
  })
  test('should get params from body', (done) => { // application/x-www-form-urlencoded
    sampleApp.post('/route5', getParam('name'), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .post('/route5')
      .send('name=test')
      .expect(200)
      .expect({ name: 'test' })
      .end(done)
  })
})
