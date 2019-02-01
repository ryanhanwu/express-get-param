const debug = require('debug')('get-param:index')

const createError = require('http-errors')
const moment = require('moment')

const fetchParameter = function (req, name) {
  debug(`Fetching parameter: [${name}]`)
  if (!req.body) {
    if (!process.env.SUPPRESS_GET_PARAM_WARNING) {
      console.warn('skipped `req.body` due to it\' undefined,\nplease check to if body-parser or express.json() is set')
    }
    return req.params[name] || req.get(name) || req.query[name]
  }
  return req.params[name] || req.get(name) || req.query[name] || req.body[name]
}
getParam.STRING = 'string'
getParam.INTEGER = 'integer'
getParam.ARRAY = 'array'
getParam.DATE = 'date'
getParam.FUNC = 'function'
let DATE_FORMAT = null

const parse = (value, parser) => {
  const parserType = typeof parser
  debug(`parserType: ${parserType}`)
  let result = ''
  switch (parserType) {
    case getParam.STRING:
      debug(`parser: ${parser}`)
      switch (parser) {
        case getParam.ARRAY:
          result = value.split(',')
          break
        case getParam.INTEGER:
          result = parseInt(value, 10)
          break
        case getParam.DATE:
          result = moment(value, DATE_FORMAT)
          break
      }
      break
    case getParam.FUNC:
      result = parser(value)
      break
    default:
      result = value
      break
  }
  return result
}

function getParam (name, {
  parser = null,
  dateFormat = null,
  validator = null,
  validationError,
  alias = null } = {}) {
  debug(`Create middleware: getParam('${name}')`)
  if (dateFormat) { DATE_FORMAT = dateFormat }
  const getParam = function (req, res, next) {
    const rawValue = fetchParameter(req, name)
    const value = rawValue ? parse(rawValue, parser) : null

    if (validator) {
      debug(`Validating param: [${name}]`)
      try {
        if (!validator(value)) {
          const error = createError(400, `Validate parameter "${name}" error with value "${value}"`)
          if (validationError) { return next(validationError(error)) }
          return next(error)
        }
      } catch (e) {
        if (validationError) { return next(validationError(e)) }
        return next(e)
      }
    }
    if (value) {
      const localParamName = alias || name
      if (res.locals[localParamName]) {
        if (!process.env.SUPPRESS_GET_PARAM_WARNING) {
          console.warn(`res.locals.${localParamName} exists and will be overwritten`)
        }
      }
      res.locals[localParamName] = value
    }
    return next()
  }
  Object.defineProperty(getParam, 'name', { value: `getParam(${name})`, writable: false })
  return getParam
}

module.exports = getParam
