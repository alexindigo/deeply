var reduceObject  = require('../lib/reduce_object.js');

// Public API
module.exports = objectAdapter;

/**
 * Adapter to merge regular (user land) objects
 *
 * Note: overrides target value
 * if it's not a regular object
 *
 * @param   {object} to - target object to update
 * @param   {object} from - object to clone
 * @param   {function} merge - iterator to merge sub elements
 * @returns {object} - modified target object
 */
function objectAdapter(to, from, merge)
{
  // transfer source values
  reduceObject(to, from, merge);

  return to;
}
