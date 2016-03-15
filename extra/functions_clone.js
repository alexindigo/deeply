// Public API
module.exports = functionsCloneAdapter;

/**
 * Clones provided source function and replaces
 * target function with the clone
 *
 * @param   {function} to - target array to ignore
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

  // clone exposed properties
  Object.keys(from).reduce(function(target, key)
  {
    target[key] = merge(undefined, from[key]);

    return target;
  }, copy);

  return copy;
}

/**
 * Creates wrapper function with the same signature
 *
 * @param   {function} source - function to clone
 * @returns {function} - wrapped function
 */
function cloneFunction(source)
{
  // make `clone` look and smell the same
  return Function('source', 'return function ' + source.name + '(' + Array(source.length + 1).join('a').split('').join(',') + '){ return source.apply(this, arguments); }')(source);
}
