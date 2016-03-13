// Public API
module.exports = dateAdapter;

/**
 * Custom `initialValue` method
 * used when default approach of creating
 * initial value for the target object
 * isn't good enough
 *
 * @returns {object.Date} - new Date object
 */
module.exports.initialValue = function()
{
  return new Date();
};

/**
 * Adapter to merge Date objects
 *
 * @param   {object.Date} to - target object to update
 * @param   {object.Date} from - Date object to clone
 * @returns {object.Date} - modified target object
 */
function dateAdapter(to, from)
{
  // transfer actual value
  to.setTime(from.valueOf());

  return to;
}
