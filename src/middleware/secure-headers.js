'use strict';

module.exports = (req, res, next) => {
  res.cache('no-cache; no-store');
  res.header('X-Frame-Options', 'DENY');
  next();
};
