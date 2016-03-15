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
  // clone exposed properties
  Object.keys(source).reduce(function(acc, key)
  {
    acc[key] = merge(acc[key], source[key]);

    return acc;
  }, target);

  return target;
}
