'use strict';

module.exports = (req) => ({
  username: req.headers['x-auth-username'],
  client: req.headers['x-auth-audience'] && String(req.headers['x-auth-audience']).split(',').filter(e => e !== 'lev-api')[0],
  groups: req.headers['x-auth-groups'] && String(req.headers['x-auth-groups']).split(',') || [],
  roles: req.headers['x-auth-roles'] && String(req.headers['x-auth-roles']).split(',') || []
});
