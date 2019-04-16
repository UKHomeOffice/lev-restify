'use strict';

module.exports = log => next => err => {
    log.error(err);
    next(err);
};
