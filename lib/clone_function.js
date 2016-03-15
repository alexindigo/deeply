// Public API
module.exports = cloneFunction;

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
