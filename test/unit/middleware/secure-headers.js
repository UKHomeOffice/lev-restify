'use strict';

const secureHeaders = require('../../../src/middleware/secure-headers');

describe('middleware/secure-headers.js', () => {
  it('is a function', () => (typeof secureHeaders).should.equal('function'));
  it('is a middleware', () => secureHeaders.length.should.equal(3));

  describe('when called with three arguments', () => {
    describe('that are req, res and next objects', () => {
      let result;

      const req = {};
      const res = {
        cache: sinon.stub(),
        header: sinon.stub()
      };
      const next = sinon.stub();

      before(() => {
        result = secureHeaders(req, res, next);
      });

      it('asks the recipient not to cache', () => res.cache.should.have.been.calledWith('no-cache; no-store'));
      it('asks the recipient not to display in a frame', () => res.header.should.have.been.calledWith('X-Frame-Options', 'DENY'));
      it('calls the next middleware', () => next.should.have.been.called);
    });
  });
});
