'use strict';

const metrics = require('../../../src/middleware/metrics');

describe('middleware/metrics.js', () => {
  it('is a function', () => (typeof metrics).should.equal('function'));
  it('is a middleware', () => metrics.length.should.equal(2));

  describe('when called with two arguments', () => {
    describe('that are req, res objects', () => {
      let result;

      const req = {};
      const res = {
        set: sinon.stub(),
        end: sinon.stub()
      };
      before(() => {
        result = metrics(req, res);
      });

      it('sends a response', () => res.end.should.have.been.called);
      it('returns a promise', () => {
        expect(result)
          .to.be.an.instanceOf(Promise)
      });
    });
  });
});
