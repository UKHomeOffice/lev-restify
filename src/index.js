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
  options = options || {};

  const name = options.name;
  const log = logger(name);
  const formatBinary = restify.formatters['application/octet-stream; q=0.2'];
  const formatText = restify.formatters['text/plain; q=0.3'];

  if (name) {
    process.title = name.replace(/[^\w]/gi, '').substr(0, 6);
  }

  const httpd = originalCreateServer(Object.assign({
    log: log
  }, options, {
    formatters: Object.assign({
      'application/gzip': formatBinary,
      'application/pdf': formatBinary,
      'application/xhtml+xml': formatText,
      'application/zip': formatBinary,
      'font/otf': formatBinary,
      'font/ttf': formatBinary,
      'font/woff': formatBinary,
      'font/woff2': formatBinary,
      'image/gif': formatBinary,
      'image/jpeg': formatBinary,
      'image/png': formatBinary,
      'image/svg+xml': formatText,
      'image/x-icon': formatBinary,
      'text/css': formatText,
      'text/html': formatText,
      'text/javascript': formatText
    }, options.formatters)
  }));

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
