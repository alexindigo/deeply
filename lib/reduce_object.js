var behaviors = require('../flags.js');

// Public API
module.exports = reduceObject;

/**
 * Iterates over own properties of the provided object
 * and copies then over to the target object.
 * While recursively running merge on the elements.
 *
 * @param   {mixed} target - target object to modify
 * @param   {mixed} source - source object to read from
 * @param   {function} merge - iterator to merge sub elements
 * @returns {mixed} - modified target object
 */
function reduceObject(target, source, merge)
{
  var context = this;

  // clone exposed properties
  Object.keys(source).reduce(function(acc, key)
  {
    if (context.allowDangerousObjectKeys !== behaviors.allowDangerousObjectKeys && isUnsafeKey(key))
    {
      return acc;
    }

    acc[key] = merge(acc[key], source[key]);

    return acc;
  }, target);

  return target;
}


/**
 * Checks if provide key is unsafe to use within object
 *
 * @param {string} key - object key to check against
 * @returns {boolean} - `true` if key is unsafe to use (e.g. __proto__), `false` otherwise
 */
function isUnsafeKey(key) {
  return ['__proto__'].indexOf(key) != -1;
}
