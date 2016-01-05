// Public API
module.exports = deeply;

/**
 * Deeply merges properties of the provided objects,
 * into the first object.
 *
 * @param {...object} object - objects to merge
 * @param {function} [reduceArrays] - reduce function for custom array merging
 * @returns {object} first object with merged in properties from other objects
 */
function deeply(/* a[, b[, ...[, reduceArrays]]] */)
{
  var o
    , prop
    , args         = Array.prototype.slice.call(arguments)
    , result       = args.shift()
    , reduceArrays = typeof args[args.length-1] == 'function' ? args.pop() : undefined
    ;

  while ((o = args.shift()))
  {
    for (prop in o)
    {
      if (!o.hasOwnProperty(prop)) continue;

      if (typeof o[prop] == 'object' && preciseTypeOf(o[prop]) == 'object')
      {
        result[prop] = deeply(result[prop] || {}, o[prop], reduceArrays);
      }
      // check if there is custom reduce function for array merging
      else if (reduceArrays && Array.isArray(o[prop]))
      {
        // make sure it's all untangled
        result[prop] = reduceArrays(result[prop] || [], Array.prototype.slice.call(o[prop]));
      }
      else
      {
        result[prop] = o[prop];
      }
    }
  }

  return result;
}

/**
 * Detects real type of the objects like `new Number(1)` and `new Boolean(true)``
 *
 * @param   {mixed} obj - object to get type of
 * @returns {string} precise type
 */
function preciseTypeOf(obj)
{
  return Object.prototype.toString.call(obj).match(/\[object\s*([^\]]+)\]/)[1].toLowerCase();
}
