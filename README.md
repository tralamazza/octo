octo
====

Octo is a node.js wrapper for the Octopart REST API.

Official [Octopart REST API documentation](http://octopart.com/api/docs/v3/rest-api).

##Quickstart

```js
var octo = require('octo')

cli = octo.createV3('myapikey');
cli.brandsByID('2239e3330e2df5fe', console.log);
```

##Features

* API fully mapped
* HTTPS by default
* Simple node.js style callbacks(err, result)

##API

TODO

    brandsByID
    brandsSearch

    categoriesByID
    categoriesSearch

    partsSearch
    partsByID
    partsMatch

    sellersByID
    sellersSearch
