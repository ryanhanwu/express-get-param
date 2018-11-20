# get-param
[![npm version](https://badge.fury.io/js/express-get-param.svg)](https://badge.fury.io/js/express-get-param)
[![Build Status](https://travis-ci.org/ryanhanwu/express-get-param.svg?branch=master)](https://travis-ci.org/ryanhanwu/express-get-param)
[![Coverage Status](https://coveralls.io/repos/github/ryanhanwu/express-get-param/badge.svg?branch=master)](https://coveralls.io/github/ryanhanwu/express-get-param?branch=master)

Express.js get parameter middleware.
## What is this about and why?
Compare with [express-param](https://www.npmjs.com/package/express-param), I prefer to see my contraller pameters being defined in the route file like following to improve to improve the code readability

```
router.get('/api/page', 
	getParam('limit'), 
	getParam('skip'),
	Contraller.pageListApi)
```

## Parameters Order
- URL Parameters:
     https://expressjs.com/en/api.html#req.params
- Headers:
     https://expressjs.com/en/api.html#req.get
- Query String:
     https://expressjs.com/en/api.html#req.query
- Body:
     https://expressjs.com/en/api.html#express.json
     https://expressjs.com/en/api.html#req.body
