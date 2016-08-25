var cloneFunction = require('fulcon')
  , reduceObject  = require('../lib/reduce_object.js')
  ;

// Public API
module.exports = functionsExtendAdapter;

/**
 * Clones provided source function and replaces
 * target function with the clone.
 * While keeping original prototype in the prototype chain.
 *
 * @param   {function} to - target function to ignore
 * @param   {function} from - function to clone
 * @param   {function} merge - iterator to merge sub elements
 * @returns {function} - cloned source function
 */
function functionsExtendAdapter(to, from, merge)
{
  var copy = cloneFunction(from);

  // keep from.prototype in the prototype chain
  copy.prototype = from.prototype;

  // duplicate function's properties
  reduceObject(copy, from, merge);

  return copy;
}
