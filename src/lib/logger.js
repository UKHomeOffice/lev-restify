'use strict';

const Bunyan = require('bunyan');

module.exports = name => new Bunyan({
  name: name
});
