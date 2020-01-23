'use strict';

module.exports = (req) => {
  const aud = req.headers['x-auth-audience'];
  const client = aud && aud.split(',').filter(e => e !== 'lev-api')[0];

  return ({
    username: req.headers['x-auth-username'],
    client: client,
    groups: req.headers['x-auth-groups'] && String(req.headers['x-auth-groups']).split(',') || [],
    roles: req.headers['x-auth-roles'] && String(req.headers['x-auth-roles']).split(',') || []
  });
};
