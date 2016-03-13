var merge = require('./merge.js');

// Public API
module.exports = mutable;

/**
 * Deeply merges properties of the provided objects, into the first object.
 *
 * @param {...mixed} value - values to merge
 * @returns {mixed} first value with merged in properties from other values
 */
function mutable(/* a[, b[, ...]] */)
{
  var source
    , args   = Array.prototype.slice.call(arguments)
    , result = args.shift()
    ;

  while ((source = args.shift()))
  {
    result = merge.call(this, result, source);
  }

  return result;
}
