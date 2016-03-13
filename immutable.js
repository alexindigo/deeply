var mutable = require('./mutable.js');

// Public API
module.exports = immutable;

/**
 * Creates untangled copy (deep clone) of the provided value,
 * and deeply merges rest of the provided values.
 *
 * @param {...mixed} value - value(s) to merge/clone
 * @returns {mixed} - deep merged copy of all the provided values
 */
function immutable(/* a[, b[, ...]] */)
{
  // invoke mutable with new object as first argument
  var args = Array.prototype.slice.call(arguments, 0);
  // use `undefined` as always-override value
  return mutable.apply(this, [undefined].concat(args));
}
