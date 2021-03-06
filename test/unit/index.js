'use strict';

const index = require('../../src');

describe('index.js', () => {
  it('is an object', () => (typeof index).should.equal('object'));
  it('has a createServer property', () => (typeof index.createServer).should.equal('function'));
  it('has an errors property', () => (typeof index.errors).should.equal('object'));
  it('has a metrics property', () => (typeof index.metrics).should.equal('object'));
  it('has a reqInfo property', () => (typeof index.reqInfo).should.equal('function'));

  describe('.createServer()', () => {
    const subject = index.createServer;

    it('is a function', () => (typeof subject).should.equal('function'));
    it('is a middleware', () => subject.length.should.equal(1));

    describe('when called with no arguments', () => {
      let result;

      before(() => {
        result = subject();
      });

      it('returns an object', () => (typeof result).should.equal('object'));

      describe('the object', () => {
        it('has a listen method', () => (typeof result.listen).should.equal('function'));
        it('has a log property', () => (typeof result.log).should.equal('object'));
        it('has a promiseRejectionHandler property', () => (typeof result.promiseRejectionHandler).should.equal('function'));
      });
    });

    describe('when called with one argument', () => {
      describe('that is an object', () => {
        let result;

        before(() => {
          result = subject({
            name: 'foo'
          });
        });

        it('returns an object', () => (typeof result).should.equal('object'));

        describe('the object', () => {
          it('has a listen method', () => (typeof result.listen).should.equal('function'));
          it('has a log property', () => (typeof result.log).should.equal('object'));
          it('has a promiseRejectionHandler property', () => (typeof result.promiseRejectionHandler).should.equal('function'));
        });
      });
    });
  });
});
