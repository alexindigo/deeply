// Public API
module.exports = arraysCombineAdapter;

/**
 * Adapter to merge arrays
 * by combining/merging it's elements
 *
 * @param   {array} to - target array to update
 * @param   {array} from - array to clone
 * @param   {function} merge - iterator to merge sub elements
 * @returns {array} - modified target object
 */
function arraysCombineAdapter(to, from, merge)
{
  // transfer actual values
  from.reduce(function(target, value, index)
  {
    // combine elements index to index
    target[index] = merge(target[index], value);

    return target;
  }, to);

  return to;
}
