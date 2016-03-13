// list of available flags
module.exports =
{
  // to prevent (reduce chance of) accidental leaking of the global variables into runtime flags
  useCustomAdapters: 'deeply:useCustomAdapters:' + Math.random()
};
