const debug = require('debug')('get-param:index')

const createError = require('http-errors')

module.exports = middlewareGetParam

const fetchParameter = function (req, name) {
  debug(`Fetching parameter: [${name}]`)
  if (!req.body) {
    throw new Error('res.body is undefined, please check your middleware and see if body-parser or express.json() is set')
  }
  return req.params[name] || req.get(name) || req.query[name] || req.body[name]
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
  debug(`Create middleware: getParam('${name}')`)
  const getParam = function (req, res, next) {
    const rawValue = fetchParameter(req, name)
    const value = rawValue ? parse(rawValue, parser) : null

    if (validator) {
      debug(`Validating param: [${name}]`)
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
  //   Object.defineProperty(getParam, 'name', { value: `getParam(${name})`, writable: false })
  return getParam
}
