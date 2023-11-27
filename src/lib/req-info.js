'use strict';

module.exports = (req) => {
  const aud = req.headers['x-auth-aud'] || req.headers['x-auth-audience'];
  const client = aud && aud.split(',').filter(e => e !== 'lev-api')[0];

  // x-original-username header set by lev-adapter. Once this is 'wired' the gatekeeper generated x-auth-username will be removed
  const user = req.headers['x-original-username'] || req.headers['x-auth-username'];

  return ({
    username: user,
    client: client,
    groups: req.headers['x-auth-groups'] && String(req.headers['x-auth-groups']).split(',') || [],
    roles: req.headers['x-auth-roles'] && String(req.headers['x-auth-roles']).split(',') || []
  });
};
