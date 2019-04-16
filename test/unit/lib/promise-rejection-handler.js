'use strict';

const logger = {
  error: sinon.stub()
};

const promiseRejectionHandler = require('../../../src/lib/promise-rejection-handler');

describe('lib/promise-rejection-handler.js', () => {
  it('is a function', () => (typeof promiseRejectionHandler).should.equal('function'));
  it('takes two arguments', () => promiseRejectionHandler.length.should.equal(2));

  describe('when called with two arguments', () => {
    describe('that are a logger and a function', () => {
      let result1;
      const next = sinon.stub();

      before(() => {
        result1 = promiseRejectionHandler(logger, next);
      });

      describe('the result', () => {
        it('is a function', () => (typeof result1).should.equal('function'));
        it('takes one argument', () => result1.length.should.equal(1));

        describe('when called with one argument', () => {
          describe('that is an error', () => {
            const err = new Error('error');

            before(() => {
              result1(err);
            });

            it('logs the error', () => logger.error.should.have.been.calledWith(err));
            it('calls the argument', () => next.should.have.been.called);
            it('calls the argument with the error', () => next.should.have.been.calledWith(err));
          });
        });
      });
    });
  });
});
