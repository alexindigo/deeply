// collect available adapters
module.exports =
{
  'array' : require('./adapters/array.js'),
  'date'  : require('./adapters/date.js'),
  'object': require('./adapters/object.js'),

  // extra adapters
  arraysCombine     : require('./extra/arrays_combine.js'),
  arraysAppend      : require('./extra/arrays_append.js'),
  arraysAppendUnique: require('./extra/arrays_append_unique.js'),
  functionsClone    : require('./extra/functions_clone.js'),
  functionsExtend   : require('./extra/functions_extend.js')
};
