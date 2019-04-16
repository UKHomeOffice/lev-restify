'use strict';

const HotShots = require('hot-shots');
const promClient = require('prom-client');
const statsdClient = new HotShots();

module.exports = {
  statsdClient: statsdClient,
  prometheus: {
    register: promClient.register
  }
};
