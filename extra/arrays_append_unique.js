// Public API
module.exports = arraysAppendUniqueAdapter;

/**
 * Adapter to merge arrays
 * by appending cloned elements
 * of the second array to the first
 * unless they already exist in the target array
 *
 * @param   {array} to - target array to update
 * @param   {array} from - array to clone
 * @param   {function} merge - iterator to merge sub elements
 * @returns {array} - modified target object
 */
function arraysAppendUniqueAdapter(to, from, merge)
{
  // transfer actual values
  from.reduce(function(target, value)
  {
    // append only if new element isn't present yet
    if (target.indexOf(value) == -1)
    {
      target.push(merge(undefined, value));
    }

    return target;
  }, to);

  return to;
}
