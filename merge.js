var preciseTypeOf = require('precise-typeof')
  , adapters      = require('./adapters.js')
  , behaviors     = require('./flags.js')
  ;

// Public API
module.exports = merge;

/**
 * Merges provided values, utilizing available adapters
 * if no adapter found, reference to the same object
 * will be returned, considering it as primitive value
 *
 * @param   {mixed} to - value to merge into
 * @param   {mixed} from - value to merge
 * @returns {mixed} - result of the merge
 */
function merge(to, from)
{
  // if no suitable adapters found
  // just return overriding value
  var result  = from
    , type    = preciseTypeOf(from)
    , adapter = getTypeAdapter.call(this, type)
    ;

  // if target object isn't the same type as the source object,
  // then override with new instance of the same type
  if (preciseTypeOf(to) != type)
  {
    to = getInitialValue(type, adapter);
  }

  // bind merge callback to the current context
  // so not to loose runtime flags
  result = adapter.call(this, to, from, merge.bind(this));

  return result;
}

/**
 * Returns merge adapter for the requested type
 * either default one or custom one if provided
 *
 * @param   {string} type - hook type to look for
 * @returns {function} - merge adapter or pass-thru function, if not adapter found
 */
function getTypeAdapter(type)
{
  var adapter = adapters[type] || passThru;

  // only if usage of custom adapters is authorized
  // to prevent global context leaking in
  if (this.useCustomAdapters === behaviors.useCustomAdapters
    && typeof this[type] == 'function'
    )
  {
    adapter = this[type];
  }

  return adapter;
}

/**
 * Creates initial value for the provided type
 *
 * @param   {string} type - type to create new value of
 * @param   {function} adapter - adapter function with custom `initialValue` method
 * @returns {mixed} - new value of the requested type
 */
function getInitialValue(type, adapter)
{
  var value
      // should be either `window` or `global`
    , glob       = typeof window == 'object' ? window : global
      // capitalize the first letter to make object constructor
    , objectType = type[0].toUpperCase() + type.substr(1)
    ;

  if (typeof adapter.initialValue == 'function')
  {
    value = adapter.initialValue();
  }
  else if (objectType in glob)
  {
    // create new type object and get it's actual value
    // e.g. `new String().valueOf() // -> ''`
    value = new glob[objectType]().valueOf();
  }

  // set initial value as `undefined` if no initialValue method found
  return value;
}

/**
 * Returns provided `from` value
 *
 * @param   {mixed} to - value to ignore
 * @param   {mixed} from - value to pass back
 * @returns {mixed} - passed `from` value
 */
function passThru(to, from)
{
  return from;
}
