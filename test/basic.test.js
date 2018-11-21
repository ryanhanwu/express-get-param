const supertest = require('supertest')

const getParam = require('../lib')
const sampleApp = require('./sampleApp')

describe('basic usage', () => {
  test('should not failed if there\'s no body parser', (done) => {
    const express = require('express')
    const app = express()
    app.get('/route', getParam('randomParam'), (req, res) => {
      res.json(res.locals)
    })
    supertest(app)
      .get('/route')
      .expect(200)
      .expect({})
      .end(done)
  })
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
  test('should overwrite params', (done) => {
    sampleApp.post('/route6', getParam('param'), getParam('param', { parser: getParam.INTEGER }), (req, res) => {
      res.json(res.locals)
    })
    supertest(sampleApp)
      .post('/route6')
      .send('param=5')
      .expect(200)
      .expect({ param: 5 })
      .end(done)
  })
})
