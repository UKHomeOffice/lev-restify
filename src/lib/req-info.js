'use strict';

module.exports = (req) => {
  // x-original-username header set by lev-adapter. Once this is 'wired' the gatekeeper generated x-auth-username will be removed
  // These values are set in a variety of places in the live service pipeline. Env variables are for local development
  const user = req.headers['x-original-username'] || req.headers['x-auth-username'] || process.env.ORIGINAL_USERNAME;
  let groups = req.headers['x-auth-groups'] && String(req.headers['x-auth-groups']).split(',') || process.env.GROUPS && String(process.env.GROUPS).split(',') || [];
  const client = req.headers['x-original-client'] || process.env.ORIGINAL_CLIENT
  const roles = req.headers['x-auth-roles'] && String(req.headers['x-auth-roles']).split(',') || process.env.ROLES && String(process.env.ROLES).split(',') || []
  const organisationId = req.headers['x-organisation-id'] || process.env.ORGANISATION_ID

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
    roles: roles,
    organisationId: organisationId
  });
};
