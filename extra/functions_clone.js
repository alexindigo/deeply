var cloneFunction = require('fulcon')
  , reduceObject  = require('../lib/reduce_object.js')
  ;

// Public API
module.exports = functionsCloneAdapter;

/**
 * Clones provided source function and replaces
 * target function with the clone.
 * Also cloning the prototype tree.
 *
 * @param   {function} to - target function to ignore
 * @param   {function} from - function to clone
 * @param   {function} merge - iterator to merge sub elements
 * @returns {function} - cloned source function
 */
function functionsCloneAdapter(to, from, merge)
{
  var copy = cloneFunction(from);

  // to fully stand up to Ludicrous name
  // let's clone prototype chain
  copy.prototype = merge(undefined, from.prototype);

  // duplicate function's properties
  reduceObject(copy, from, merge);

  return copy;
}
