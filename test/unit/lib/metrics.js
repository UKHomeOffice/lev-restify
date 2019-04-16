'use strict';

const metrics = require('../../../src/lib/metrics');

describe('lib/metrics.js', () => {
  describe('statsdClient', () => {
    const subject = metrics.statsdClient;

    it('is an object', () => (typeof subject).should.equal('object'));
  });

  describe('prometheus', () => {
    const subject = metrics.prometheus;

    it('is an object', () => (typeof subject).should.equal('object'));

    describe('prometheus.register', () => {
      const subject = metrics.prometheus;

      it('is an object', () => (typeof subject).should.equal('object'));
    });
  });
});
