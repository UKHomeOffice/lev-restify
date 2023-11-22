'use strict';

module.exports = (req) => {
  const aud = req.headers['x-auth-aud'] || req.headers['x-auth-audience'];
  const client = aud && aud.split(',').filter(e => e !== 'lev-api')[0];
  const user = req.headers['x-user-id'] || req.headers['x-auth-username'];

  return ({
    username: user,
    client: client,
    groups: req.headers['x-auth-groups'] && String(req.headers['x-auth-groups']).split(',') || [],
    roles: req.headers['x-auth-roles'] && String(req.headers['x-auth-roles']).split(',') || []
  });
};
