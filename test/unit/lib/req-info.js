'use strict';

const reqInfo = require('../../../src/lib/req-info');

describe('lib/req-info.js', () => {
  it('is a function', () => (typeof reqInfo).should.equal('function'));
  it('takes one argument', () => reqInfo.length.should.equal(1));

  describe('when called with one argument', () => {
    describe('that is a request object', () => {
      describe('without keycloak-gatekeeper/lev-adapter headers', () => {
        let result;

        before(() => {
          result = reqInfo({
            headers: {}
          });
        });

        it('returns a more friendly object', () => result.should.deep.equal({
          client: undefined,
          groups: [],
          roles: [],
          username: undefined
        }));
      });

      describe('with keycloak-gatekeeper/lev-adapter headers', () => {
        describe('with a single audience using (short header) x-auth-aud', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-auth-aud': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-auth-username': 'username'
              }
            });
          });

          it('returns a more friendly object', () => result.should.deep.equal({
            client: 'client',
            groups: [
              'group1',
              'group2',
              'group3'
            ],
            roles: [
              'role1',
              'role2',
              'role3'
            ],
            username: 'username'
          }));
        });

        describe('with multiple audiences', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-auth-audience': 'client,lev-api',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-auth-username': 'username'
              }
            });
          });

          it('returns a more friendly object', () => result.should.deep.equal({
            client: 'client',
            groups: [
              'group1',
              'group2',
              'group3'
            ],
            roles: [
              'role1',
              'role2',
              'role3'
            ],
            username: 'username'
          }));
        });
        describe('x-original-username header set in lev-adapter', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-auth-audience': 'client,lev-api',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username'
              }
            });
          });

          it('uses the original user name set in lev-adapter', () => result.should.deep.equal({
            client: 'client',
            groups: [
              'group1',
              'group2',
              'group3'
            ],
            roles: [
              'role1',
              'role2',
              'role3'
            ],
            username: 'original-username'
          }));
        });
        describe('both x-original-username header set in lev-adapter and x-auth-username from gatekeeper', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-auth-audience': 'client,lev-api',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-auth-username': 'username'
              }
            });
          });

          it('sets the username as the x-original-username and ignores x-auth-username ', () => result.should.deep.equal({
            client: 'client',
            groups: [
              'group1',
              'group2',
              'group3'
            ],
            roles: [
              'role1',
              'role2',
              'role3'
            ],
            username: 'original-username'
          }));
        });
      });
    });
  });
});
