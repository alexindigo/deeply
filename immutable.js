var mutable = require('./mutable.js');

// Public API
module.exports = immutable;

/**
 * Creates untangled copy (deep clone) of the provided object,
 * and deeply merges properties of the rest of the provided objects.
 *
 * @param {...object} object - objects to merge/clone
 * @param {function} [reduceArrays] - reduce function for custom array merging
 * @returns {object} deep merged copy of all the provided objects
 */
function immutable(/* a[, b[, ...[, reduceArrays]]] */)
{
  // invoke mutable with new object as first argument
  var args = Array.prototype.slice.call(arguments, 0);
  return mutable.apply(this, [{}].concat(args));
}
