// Public API
module.exports = arraysAppendAdapter;

/**
 * Adapter to merge arrays
 * by appending cloned elements
 * of the second array to the first
 *
 * @param   {array} to - target array to update
 * @param   {array} from - array to clone
 * @param   {function} merge - iterator to merge sub elements
 * @returns {array} - modified target object
 */
function arraysAppendAdapter(to, from, merge)
{
  // transfer actual values
  from.reduce(function(target, value)
  {
    target.push(merge(undefined, value));

    return target;
  }, to);

  return to;
}
