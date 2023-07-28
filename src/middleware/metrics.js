'use strict';

const metrics = require('../lib/metrics');
const register = metrics.promClient.register;

module.exports = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
