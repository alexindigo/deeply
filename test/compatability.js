var test      = require('tape').test
  , partial   = require('lodash.partialright')
  , deeply    = require('../')
  , stringify = partial(require('util').inspect, {depth: 8})
  , now       = new Date()
  , withStuffOnPrototype
  ;

  // tests
var inout = [
    {in: [{a: 1}, {b: 2}, {c: 3}], out: {a: 1, b: 2, c: 3} }
  , {in: [{a: 1}, {a: 2}, {a: 3}], out: {a: 3} }
  , {in: [{a: 1}, {a: 2}, {b: 3}], out: {a: 2, b: 3} }

  // nested
  , {
    in: [
      {
        a: {
          a1: {a11: 1, a12: 2, a13: 3},
          a2: {a21: 'a', a22: 'b', a23: 'c'},
          a3: {a31: function(){}, a32: null, a33: false, a34: true, a35: undefined, a36: Infinity, a37: NaN}
        },
        b: -Infinity
      },
      {
        a: {
          a4: {a31: function(){}, a32: null, a33: false, a34: true, a35: undefined, a36: Infinity, a37: NaN}
        }
      }
    ],
    out: {
      a: {
        a1: {a11: 1, a12: 2, a13: 3},
        a2: {a21: 'a', a22: 'b', a23: 'c'},
        a3: {a31: function(){}, a32: null, a33: false, a34: true, a35: undefined, a36: Infinity, a37: NaN},
        a4: {a31: function(){}, a32: null, a33: false, a34: true, a35: undefined, a36: Infinity, a37: NaN}
      },
      b: -Infinity
    }
  }

  // objects
  , {
    in: [
      {
        a: {a: {a: 1}, b: [1,2,4], c: now}
      },
      {
        a: {d: new Boolean(true), e: new Number(1), f: new String('abc')}
      }
    ],
    out: {
      a: {a: {a: 1}, b: [1,2,4], c: now, d: new Boolean(true), e: new Number(1), f: new String('abc')}
    }
  }

  // default array merging: replacement
  , {
    in: [ { a: { b: [0, 2, 4] }}, { a: {b: [1, 3, 5] }} ],
    out: { a: { b: [1, 3, 5] }}
  }
  , {
    in: [ { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: { b: [1, 3, 5, 5, 3, 1] }} ],
    out: { a: { b: [1, 3, 5, 5, 3, 1] }}
  }

  // custom array merging
  , {
    in: [ { a: { b: [0, {x: 'a'}, 4, {a: 1, b: 2}] }}, { a: {b: [1, 3, 5, {a: 10, c: 20}] }} ],
    out: { a: { b: [0, {x: 'a'}, 4, {a: 1, b: 2}, 1, 3, 5, {a: 10, c: 20}] }},
    // custom merge: append
    customAdapters: {array: deeply.adapters.arraysAppend}
  }
  , {
    in: [ { a: { b: [0, 2, 4, 2, {x: 'a'}] }}, { a: { b: [0, 1, 3, 4, 5, 5, 3, 1] }} ],
    out: { a: { b: [0, 2, 4, { x: 'a' }, 1, 3, 5] }},
    // custom merge: append + unique
    customAdapters: {array: deeply.adapters.arraysAppendUnique}
  }
  , {
    in: [ { a: { b: [0, {x: 'a'}, 4, {a: 1, b: 2}, 6] }}, { a: {b: [1, 3, 5, {a: 10, c: 20}] }} ],
    out: { a: { b: [1, 3, 5, {a: 10, b: 2, c: 20}, 6] }},
    // custom merge: combine
    customAdapters: {array: deeply.adapters.arraysCombine}
  }
  , {
    in: [ { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: { b: [1, 3, 5, 5, 3, 1] }} ],
    out: { a: { b: [0, 1, 2, 3, 4, 5] }},
    // custom custom merge: append + unique + sort
    customAdapters: {array: function appendUniqueAndSort(to, from, merge)
    {
      from.forEach(function(value)
      {
        // append only if new element isn't present yet
        if (to.indexOf(value) == -1)
        {
          to.push(merge(undefined, value));
        }
      });

      // and sort
      return to.sort();
    }}
  }

  // array of objects
  , {
    in: [{a: [{b: 1}, {c: 2}]}],
    out: {a: [{b: 1}, {c: 2}]},
    // modify after merge to see they're independent
    modify: function(a, b) { a.a[0].d = 3; b.a[1].e = 5; }
  }

  // nested array of objects
  , {
    in: [{a: [{b: [{b1: [{b11: null, b12: ['121', '122']}, {b13: []}]}, {b2: [{}, {b22: [{b221: [{b2211: '2211'}]}]}]}], c: [{c1: 25}, {c2: [{c21: {c211: '211'}}, {}]}], d: {e: 5}}]}],
    out: {a: [{b: [{b1: [{b11: null, b12: ['121', '122']}, {b13: []}]}, {b2: [{}, {b22: [{b221: [{b2211: '2211'}]}]}]}], c: [{c1: 25}, {c2: [{c21: {c211: '211'}}, {}]}], d: {e: 5}}]},
    modify: function(a, b) { a.a[0].b[0].b1[0].b12.push('567'); b.a[0].b[0].b1[0].b11 = '456'; }
  }

  // clone arrays
  , {
    in: [ [13, 'ABC', {x: {y: {z: ['5', 6]}}}, now] ],
    out: [13, 'ABC', {x: {y: {z: ['5', 6]}}}, now],
    modify: function(a, b) { a[2].x.y1 = 25; b[2].x.y1 = 74; }
  }

  // clone functions
  , {
    in: [ { a: { b: [0, {x: 'a'}, 4, function(a, b) { return a + b + 5; }] }}, { a: {b: [1, 3, 5, function testFunc(a, b, c){ return 100 - a - b - c; }] }} ],
    out: { a: { b: [0, {x: 'a'}, 4, function(a, b){ return a + b; }, 1, 3, 5, function testFunc(a, b, c){ return a + b + c; }] }},
    // custom merge: append
    customAdapters: {function: deeply.adapters.functionsClone, array: deeply.adapters.arraysAppend}
  }

  // works with primitive values
  , {in: [25], out: 25},
  , {in: ['ABC'], out: 'ABC'}

  // edge cases
  , {in: ['ABC', 25, true], out: true}
  , {in: [{a: 13}], out: {a: 13}}
  , {in: [now], out: now}
];

/**
 * Example constructor to test
 * properties on prototypes
 *
 * @constructor
 */
function someConstructor()
{
  this.localVar = 34;
}
someConstructor.prototype.shouldNotBeHere = '25';

// Prepare test object
withStuffOnPrototype = new someConstructor();
withStuffOnPrototype.here = 'there';
withStuffOnPrototype.boom = 'zoom';

// add it to the test suite
inout.push({
  in: [withStuffOnPrototype],
  out: {localVar: 34, here: 'there', boom: 'zoom'}
});

// Run tests
test('merge', function test_deep_merge(t)
{
  inout.forEach(function(pair)
  {
    var context = null;

    // turn on customAdapters
    if ('customAdapters' in pair)
    {
      context = pair.customAdapters;
      context['useCustomAdapters'] = deeply.behaviors.useCustomAdapters;
    }

    // default - immutable

    var res = deeply.apply(context, pair.in);
    t.deepEqual(stringify(res), stringify(pair.out), 'merged '+stringify(pair.in)+' into '+stringify(res)+', expected '+stringify(pair.out));

    // custom modification check
    if (pair.in.length == 1 && typeof pair.modify == 'function')
    {
      pair.modify(pair.in[0], res);
      // check that object's don't equal after modification
      t.notDeepEqual(stringify(res), stringify(pair.in[0]), 'modified '+stringify(pair.in[0])+' should not be equal to '+stringify(res));
    }
  });

  // done
  t.end();
});
