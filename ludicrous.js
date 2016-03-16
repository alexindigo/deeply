// Ludicrous Mode, including functions cloning/merging
var immutable = require('./immutable.js')
  , adapters  = require('./adapters.js')
  , behaviors = require('./flags.js')
  ;

// Public API
// pre-supply function cloning flags
module.exports = immutable.bind({
  useCustomAdapters: behaviors.useCustomAdapters,
  'function'       : adapters.functionsClone
});
