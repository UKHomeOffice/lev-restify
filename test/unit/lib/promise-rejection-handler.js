'use strict';

const promiseRejectionHandler = require('../../../src/lib/promise-rejection-handler');

describe('lib/promise-rejection-handler.js', () => {
  it('is a function', () => (typeof promiseRejectionHandler).should.equal('function'));
  it('takes one argument', () => promiseRejectionHandler.length.should.equal(1));

  describe('when called with one argument', () => {
    describe('that is a logger', () => {
      let result1;

      const logger = {
        error: sinon.stub()
      };

      before(() => {
        result1 = promiseRejectionHandler(logger);
      });

      describe('the result', () => {
        it('is a function', () => (typeof result1).should.equal('function'));
        it('takes one argument', () => result1.length.should.equal(1));

        describe('when called with one argument', () => {
          describe('that is a function', () => {
            let result2;

            const next = sinon.stub();

            before(() => {
              result2 = result1(next);
            });

            describe('the result', () => {
              it('is a function', () => (typeof result2).should.equal('function'));
              it('takes one argument', () => result2.length.should.equal(1));

              describe('when called with one argument', () => {
                describe('that is an error', () => {
                  const err = new Error('error');

                  before(() => {
                    result2(err);
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
    });
  });
});
