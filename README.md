Life Event Verification's Restify server
========================================

A highly opinionated [Restify] server for use in the Life Event Verification
(LEV) project.

The server features:
- JSON logging (via Bunyan) and logs special headers provided by
  [keycloak-gatekeeper].
- A simple liveness health-check on `/healthz`.
- 'Secure' headers on every response.
- Bundled functionality for custom metrics and some helper functions.

Usage
=====

Simple require this package:
```js
const restify = require('lev-restify');
```

You can then create a [Restify] server using `createServer()` and access bundled
functionality by accessing properties on the object.

```js
const httpd = restify.createServer({ name: 'my-server' });
const log = httpd.log;

httpd.listen(8080, '0.0.0.0', () => {
  log.info('%s listening at %s', httpd.name, httpd.url);
});
```

(In addition, the object returned by `createServer()` has an extra property,
`.log` which contains the logger. This can be used for logging outside the
context of a request, when `req.log` is available.)

Testing
-------

To test changes to this repository simply run:
```bash
make test
```

[keycloak-gatekeeper]: https://github.com/keycloak/keycloak-gatekeeper
[Restify]: http://restify.com/
