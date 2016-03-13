// Public API
module.exports = arrayAdapter;

/**
 * Adapter to merge arrays
 *
 * Note: resets target value
 *
 * @param   {array} to - target array to update
 * @param   {array} from - array to clone
 * @param   {function} merge - iterator to merge sub elements
 * @returns {array} - modified target object
 */
function arrayAdapter(to, from, merge)
{
  // reset target array
  to.splice(0);

  // transfer actual values
  from.reduce(function(target, value, index)
  {
    // use `undefined` as always-override value
    target[index] = merge(undefined, value);

    return target;
  }, to);

  return to;
}
