'use strict';

const errors = require('restify-errors');
const healthCheck = require('./middleware/health-check');
const logger = require('./lib/logger');
const metrics = require('./middleware/metrics');
const metricsLib = require('./lib/metrics');
const promiseRejectionHandler = require('./lib/promise-rejection-handler');
const restify = require('restify');
const restifyBunyanLogger = require('restify-bunyan-logger');
const reqInfo = require('./lib/req-info');
const secureHeaders = require('./middleware/secure-headers');

const originalCreateServer = restify.createServer.bind(restify);

const createServer = options => {
  const name = options.name;
  const log = logger(name);

  process.title = name.replace(/[^\w]/gi, '').substr(0, 6);

  const httpd = originalCreateServer(Object.assign({
    log: log
  }, options));

  httpd.log = log;
  httpd.promiseRejectionHandler = promiseRejectionHandler(log),

  httpd.use(restify.plugins.requestLogger({
    headers: [
      'x-auth-aud',
      'x-auth-username',
      'x-auth-groups'
    ]
  }));
  httpd.use(restify.plugins.acceptParser(httpd.acceptable));
  httpd.use(restify.plugins.queryParser({ mapParams: false }));
  httpd.use(restify.plugins.fullResponse());
  httpd.use(secureHeaders);
  httpd.on('after', restifyBunyanLogger());

  httpd.get('/healthz', healthCheck.liveness);
  httpd.get('/metrics', metrics);

  return httpd;
};

module.exports = Object.assign(restify, {
  createServer: createServer,
  errors: errors,
  metrics: metricsLib,
  reqInfo: reqInfo
});
