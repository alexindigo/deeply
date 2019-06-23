// list of available flags
module.exports =
{
  // allow (original) unsafe behavior of merge all properties, including ones like `__proto__`
  allowDangerousObjectKeys: 'deeply:allowDangerousObjectKeys:' + Math.random(),

  // to prevent (reduce chance of) accidental leaking of the global variables into runtime flags
  useCustomAdapters: 'deeply:useCustomAdapters:' + Math.random(),
  useCustomTypeOf: 'deeply:useCustomTypeOf:' + Math.random()
};
