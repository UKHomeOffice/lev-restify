'use strict';

module.exports = (req) => {
  // x-original-client header set by lev-adapter. If it's set, this is what we want to reflect further downstream.
  let client = req.headers['x-original-client'];
  if (!client) {
    const aud = req.headers['x-auth-aud'] || req.headers['x-auth-audience'];
    client = aud && aud.split(',').filter(e => e !== 'lev-api')[0];
  }

  // x-original-username header set by lev-adapter. Once this is 'wired' the gatekeeper generated x-auth-username will be removed
  const user = req.headers['x-original-username'] || req.headers['x-auth-username'];

  let groups = req.headers['x-auth-groups'] && String(req.headers['x-auth-groups']).split(',') || [];
  try {
    const parsed = JSON.parse(req.headers['x-groups-internal'].toString());
    if (Array.isArray(parsed)) {
      groups = groups.concat(parsed);
    }
  } catch (e) {
    // Don't care if this fails.
  }

  return ({
    username: user,
    client: client,
    groups: groups,
    roles: req.headers['x-auth-roles'] && String(req.headers['x-auth-roles']).split(',') || []
  });
};
