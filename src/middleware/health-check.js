'use strict';

module.exports = {
  liveness: (req, res, next) => {
    res.send('OK');
  }
};
