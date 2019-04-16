'use strict';

const healthCheck = require('../../../src/middleware/health-check');

describe('middleware/healthcheck.js', () => {
  describe('.liveness()', () => {
    const subject = healthCheck.liveness;

    it('is a function', () => (typeof subject).should.equal('function'));
    it('is a middleware', () => subject.length.should.equal(3));

    describe('when called with three arguments', () => {
      describe('that are req, res and next objects', () => {
        let result;

        const req = {};
        const res = {
          send: sinon.stub()
        };
        const next = sinon.stub();

        before(() => {
          result = subject(req, res, next);
        });

        it('sends a 200 response', () => res.send.should.have.been.calledWith('OK'));
      });
    });
  });
});
