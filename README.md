# get-param
[![npm version](https://img.shields.io/npm/v/express-get-param.svg)](https://badge.fury.io/js/express-get-param)
[![Build Status](https://travis-ci.org/ryanhanwu/express-get-param.svg?branch=master)](https://travis-ci.org/ryanhanwu/express-get-param)
[![Coverage Status](https://coveralls.io/repos/github/ryanhanwu/express-get-param/badge.svg?branch=master)](https://coveralls.io/github/ryanhanwu/express-get-param?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Express.js get parameter middleware.

## Installation
```
npm install express-get-param
```
or

```
yarn add express-get-param
```

## Basic Usage
```app.js
const express = require('express')
const app = express()
const getParam = require('express-get-param')

app.use(getParam('parameterName, {Options}))
or 
app.get('/', getParam('parameterName, {Options}), controller)
```

## What is this about and why?
This is a middleware which allows you to extract parameter value from request parameters, headers, query string, or body. It's like the old time `req.param` in Express.js 3 but more powerful.

Compare with [express-param](https://www.npmjs.com/package/express-param), defining controller related parameters in the route file will definitely improve the code readability.

### Example:
#### Before:

```route.js
//route.js
router.get('/api/page/:pageName', Contraller.pageList)
```

```controller.js
//controller.js
(req, res)=>{
   const pageName = req.param('pageName')
   const limit = req.query.limit || 0
   const skip = req.query.skip || 0
   // Probably more query parameters I will take....
   ...
}
```

#### After:

```route.js
//route.js

...
router.get('/api/page/:pageName',
	getParam('limit'),
	getParam('skip'),
	Contraller.pageList)
```

```controller.js
//controller.js
(req, res)=>{
	const { limit, skip, pageName } = res.locals
   ...
}
```
### The parameters Fetching Order
- URL Parameters:
     https://expressjs.com/en/api.html#req.params
- Headers:
     https://expressjs.com/en/api.html#req.get
- Query String:
     https://expressjs.com/en/api.html#req.query
- Body:
     https://expressjs.com/en/api.html#express.json
     https://expressjs.com/en/api.html#req.body


## Additional Options
- `parser` (String or Function): Parse raw parameter value
    - String
	    - `getParam.STRING`
	    - `getParam.INTEGER`
	    - `getParam.ARRAY`
	       - Note: getParam.ARRAY will parse comma-separated string into array
    - Function: 
	    - return: parsed value

		```
		getParam('paramName', {parser:(paramValue)=>{return paramValue}})
		```
- `validator` (Function): Validate raw parameter value
       - return: boolean
       - 
- `validationError` (Function):
- `alias` (String): 
	The name which will be used to save to res.locals

	```
	getParam('paramName', {alias: 'paramName2'})
	...//in later routes
	const param = res.locals.paramName2 
	```

### Env Vars
- `SUPPRESS_GET_PARAM_WARNING`: Disable all warnings (Default: false)

## Debugging
Use environment **DEBUG** to show debug logs

```
DEBUG=get-param:*
```

## Testing


