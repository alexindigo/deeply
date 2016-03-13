// collect available adapters
module.exports =
{
  'array' : require('./adapters/array.js'),
  'date'  : require('./adapters/date.js'),
  'object': require('./adapters/object.js'),

  // optional adapters
  arraysCombine    : require('./adapters/array_combine.js'),
  arraysAppend     : require('./adapters/array_append.js'),
  arrayAppendUnique: require('./adapters/array_append_unique.js')
};
