// Prevent Restify 11 from loading SPDY (legacy, broken on Node 20+)
const Module = require('module');
const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  if (request === 'spdy') {
    // return a fake module that does nothing
    return {};
  }
  return originalLoad(request, parent, isMain);
};