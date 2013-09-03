var test    = require('tape').test
  , inspect = require('util').inspect
  , merge   = require('../')

  // tests
  inout =
  [ {in: [{a: 1}, {b: 2}, {c: 3}], out: {a: 1, b: 2, c: 3} }
  , {in: [{a: 1}, {a: 2}, {a: 3}], out: {a: 3} }
  , {in: [{a: 1}, {a: 2}, {b: 3}], out: {a: 2, b: 3} }

  // nested
  , {
      in:
      [
        {
          a:
          {
            a1: {a11: 1, a12: 2, a13: 3},
            a2: {a21: 'a', a22: 'b', a23: 'c'},
            a3: {a31: function(){}, a32: null, a33: false, a34: true, a35: undefined, a36: Infinity, a37: NaN}
          },
          b: -Infinity
        },
        {
          a:
          {
            a4: {a31: function(){}, a32: null, a33: false, a34: true, a35: undefined, a36: Infinity, a37: NaN}
          }
        }
      ],
      out:
      {
        a:
        {
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
      in:
      [
        {
          a: {a: {a: 1}, b: [1,2,4], c: new Date()}
        },
        {
          a: {d: new Boolean(true), e: new Number(1), f: new String('abc')}
        }
      ],
      out:
      {
        a: {a: {a: 1}, b: [1,2,4], c: new Date(), d: new Boolean(true), e: new Number(1), f: new String('abc')}
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
      in: [ { a: { b: [0, 2, 4] }}, { a: {b: [1, 3, 5] }} ],
      out: { a: { b: [0, 2, 4, 1, 3, 5] }},
      // custom merge: combination
      reduceArrays: function(a, b){ return (a||[]).concat(b); }
    }
  , {
      in: [ { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: { b: [1, 3, 5, 5, 3, 1] }} ],
      out: { a: { b: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5] }},
      // custom merge: combination + sort
      reduceArrays: function(a, b){ var r=(a||[]).concat(b); return r.sort(); }
    }
  , {
      in: [ { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: { b: [1, 3, 5, 5, 3, 1] }} ],
      out: { a: { b: [0, 1, 2, 3, 4, 5] }},
      // custom merge: combination + sort + unique
      reduceArrays: function(a, b){ var r=[], n=(a||[]).concat(b); for (var i=0; i<n.length; i++) { r.indexOf(n[i]) == -1 && r.push(n[i]); } return r.sort(); }
    }
  ]
  ;

// merge
test('merge', function test_timeless_toMilliseconds(t)
{
  // planning to have 1 test per file
  t.plan(inout.length);

  inout.forEach(function(pair)
  {
    var res = merge.apply(this, pair.in.concat([pair.reduceArrays]));
    t.deepEqual(inspect(res), inspect(pair.out), 'merged '+inspect(pair.in, true, 4)+' into '+inspect(res, true, 4)+', expected '+inspect(pair.out, true, 4));
  });
});

// clone
