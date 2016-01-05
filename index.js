var mutable   = require('./mutable.js')
  , immutable = require('./immutable.js')
  ;

// Public API
// keep immutable behavior as default
module.exports = immutable;
// expose both options
module.exports.mutable   = mutable;
module.exports.immutable = immutable;
