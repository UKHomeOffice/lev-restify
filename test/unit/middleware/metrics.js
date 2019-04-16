'use strict';

const metrics = require('../../../src/middleware/metrics');

describe('middleware/metrics.js', () => {
  it('is a function', () => (typeof metrics).should.equal('function'));
  it('is a middleware', () => metrics.length.should.equal(3));

  describe('when called with three arguments', () => {
    describe('that are req, res and next objects', () => {
      let result;

      const req = {};
      const res = {
        set: sinon.stub(),
        end: sinon.stub()
      };
      const next = sinon.stub();

      before(() => {
        result = metrics(req, res, next);
      });

      it('sends a response', () => res.end.should.have.been.called);
    });
  });
});
