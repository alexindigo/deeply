var fs        = require('fs')
  , path      = require('path')
  , test      = require('tape').test
  , deeply    = require('../')
  , reamde    = require('reamde')
  , partial   = require('lodash.partialright')
  , content   = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf-8')
  , stringify = partial(require('util').inspect, {depth: 8})
  , examples
  ;

examples = reamde(content, {
  runtime:
  [
    'callback'
  ],
  replace:
  {
    'require(\'deeply\')'         : deeply,
    'require(\'deeply/mutable\')' : deeply.mutable,
    'assert.equal('               : 'callback('
  }
});

// Run tests
test('readme', function test_readme_examples(t)
{
  examples.forEach(function(ex)
  {
    ex(function(actual, expected)
    {
      t.deepEqual(stringify(actual), stringify(expected), 'actual ' + stringify(actual) + ', expected ' + stringify(expected));
    });
  });

  t.end();
});
