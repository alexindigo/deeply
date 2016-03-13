var behaviors = require('./flags.js')
  , adapters  = require('./adapters.js')
  , mutable   = require('./mutable.js')
  , immutable = require('./immutable.js')
  ;

// Public API
// keep immutable behavior as default
module.exports = immutable;
// expose both variants
module.exports.mutable   = mutable;
module.exports.immutable = immutable;
// expose behavior flags
module.exports.behaviors = behaviors;
// expose available adapters
module.exports.adapters  = adapters;
