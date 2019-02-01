const moment = require('moment')
const chai = require('chai')

const expect = chai.expect
const getParam = require('../lib')

test('should get date value as a moment instance', (done) => {
  const middleware = getParam('testdate', {
    parser: getParam.DATE
  })
  const req = {
    params: {
      testdate: '2019-01-24'
    }
  }
  const res = {
    locals: {}
  }
  middleware(req, res, (err) => {
    expect(res.locals.testdate).be.instanceOf(moment)
    expect(res.locals.testdate.format('DD-MM-YYYY')).to.equal('24-01-2019')
    done(err)
  })
})
