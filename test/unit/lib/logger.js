'use strict';

const logger = require('../../../src/lib/logger');

describe('lib/logger.js', () => {
  it('is a function', () => (typeof logger).should.equal('function'));
  it('takes one argument', () => logger.length.should.equal(1));

  describe('when called with one argument', () => {
    describe('that is a string', () => {
      let result1;

      before(() => {
        result1 = logger('foo');
      });

      describe('the result', () => {
        it('is an object', () => (typeof result1).should.equal('object'));
      });
    });
  });
});
