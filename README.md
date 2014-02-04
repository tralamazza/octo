octo
====

Octo is a node.js wrapper for the Octopart REST API.

Official [Octopart REST API documentation](http://octopart.com/api/docs/v3/rest-api).

##Quickstart

```js
var octo = require('octo')

cli = octo.createV3('myapikey');

cli.brandsByID('2239e3330e2df5fe', console.log);
// OR
cli.brandsByID(['2239e3330e2df5fe'], console.log);

cli.brandsSearch({q: 'TI'}, console.log);
// OR
cli.brandsSearch([{q: 'TI'},{limit: 1}], console.log);

cli.partsMatch({ queries: [{mpn: "SN74S74N"}], exact_only: true }, console.log);
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

##License

Copyright (C) 2014 Daniel Tralamazza

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
