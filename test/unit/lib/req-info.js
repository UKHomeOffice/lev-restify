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
          username: undefined,
          organisationId: undefined
        }));
      });

      describe('with keycloak-gatekeeper/lev-adapter headers', () => {
        describe('with a single client using (short header) x-original-client', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-auth-username': 'username',
                'x-organisation-id': 'organisationId'
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
            username: 'username',
            organisationId: 'organisationId'
          }));
        });

        describe('with multiple audiences', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-auth-username': 'username',
                'x-organisation-id': 'organisationId'
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
            username: 'username',
            organisationId: 'organisationId'
          }));
        });
        describe('x-original-username header set in lev-adapter', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-organisation-id': 'organisationId'
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
            username: 'original-username',
            organisationId: 'organisationId'
          }));
        });
        describe('both x-original-username header set in lev-adapter and x-auth-username from gatekeeper', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-auth-username': 'username',
                'x-organisation-id': 'organisationId'
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
            username: 'original-username',
            organisationId: 'organisationId'
          }));
        });
        describe('testing the presence of internal groups in the header', () => {
          let result;

          before(() => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-auth-username': 'username',
                'x-organisation-id': 'organisationId'
              }
            });
          });

          it('appends any groups in the internal groups header', () => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-auth-username': 'username',
                'x-groups-internal': '["group4","group5","group6"]',
                'x-organisation-id': 'organisationId'
              }
            });
            result.should.deep.equal({
              client: 'client',
              groups: ['group1', 'group2', 'group3', 'group4', 'group5', 'group6'],
              roles: ['role1', 'role2', 'role3'],
              username: 'original-username',
              organisationId: 'organisationId'
            })
          });
          it('ignores any invalid structures in the header', () => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-auth-username': 'username',
                'x-groups-internal': 'invalid json',
                'x-organisation-id': 'organisationId'
              }
            });
            result.should.deep.equal({
              client: 'client',
              groups: ['group1', 'group2', 'group3'],
              roles: ['role1', 'role2', 'role3'],
              username: 'original-username',
              organisationId: 'organisationId'
            })
          });
          it('ignores any valid json structures that do not resolve to an array', () => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-groups': 'group1,group2,group3',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-auth-username': 'username',
                'x-groups-internal': '{"group4": "extra", "group5": "extra", "group6": "extra"}',
                'x-organisation-id': 'organisationId'
              }
            });
            result.should.deep.equal({
              client: 'client',
              groups: ['group1', 'group2', 'group3'],
              roles: ['role1', 'role2', 'role3'],
              username: 'original-username',
              organisationId: 'organisationId'
            })
          });
          it('copes with groups only coming from the internal header', () => {
            result = reqInfo({
              headers: {
                'x-original-client': 'client',
                'x-auth-roles': 'role1,role2,role3',
                'x-original-username': 'original-username',
                'x-auth-username': 'username',
                'x-groups-internal': '["group4","group5","group6"]',
                'x-organisation-id': 'organisationId'
              }
            });
            result.should.deep.equal({
              client: 'client',
              groups: ['group4', 'group5', 'group6'],
              roles: ['role1', 'role2', 'role3'],
              username: 'original-username',
              organisationId: 'organisationId'
            })
          });
        });
      });
      describe('req info set using env variables', () => {
        const originalEnv = process.env;

        beforeEach(() => {
          process.env = { ...originalEnv, ROLES: 'envRole1,envRole2', GROUPS: 'testgroup1,testgroup2', ORIGINAL_CLIENT: 'testclient', ORIGINAL_USERNAME: 'testuser', ORGANISATION_ID: 'bf3adbd2-0107-4370-b926-741e2a8c2b7b' };
        });

        afterEach(() => {
          process.env = originalEnv;
        });

        it('uses env variables when headers are missing', () => {
          const result = reqInfo({
            headers: {}
          });

          expect(result).to.deep.equal({
            client: 'testclient',
            groups: ['testgroup1', 'testgroup2'],
            roles: ['envRole1', 'envRole2'],
            username: 'testuser',
            organisationId: 'bf3adbd2-0107-4370-b926-741e2a8c2b7b'
          });
        });
      })
    });
  });
});
