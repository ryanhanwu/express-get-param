const debug = require('debug')('get-param:index')

const createError = require('http-errors')

module.exports = middlewareGetParam

const fetchParameter = function (req, name) {
  return req.params[name] || // URL Parameters: https://expressjs.com/en/api.html#req.params
  req.get(name) || // Headers: https://expressjs.com/en/api.html#req.get
  req.query[name] || // Query String: https://expressjs.com/en/api.html#req.query
  req.body[name] // Body: https://expressjs.com/en/api.html#req.body
}

const parse = (value, parser) => {
  const parserType = typeof parser
  if (parserType === 'string' && parser === 'array') {
    return value.split(',')
  } else if (parserType === 'string' && parser === 'integer') {
    return parseInt(value, 10)
  } else if (parserType === 'function') {
    return parser(value)
  } else {
    return value
  }
}

function middlewareGetParam (name, {
  parser = null,
  validator = null,
  validationError,
  alias = null } = {}) {
  debug(`Initialize middleware: ${name}`)
  const getParam = function (req, res, next) {
    const rawValue = fetchParameter(req, name)
    const value = rawValue ? parse(rawValue, parser) : null
    if (validator) {
      try {
        if (!validator(value)) {
          return next(createError(400, `Validation Error - [${name}]: ${value}`))
        }
      } catch (e) {
        if (validationError) { return next(validationError(e)) }
        return next(e)
      }
    }
    if (value) {
      const localParamName = alias || name
      if (res.locals.localParamName) {
        debug(`res.locals.${localParamName} exists and will be overwritten`)
      }
      res.locals[localParamName] = value
    }
    return next()
  }
  Object.defineProperty(getParam, 'name', { value: `getParam(${name})`, writable: false })
  return getParam
}
