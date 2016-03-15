# Deeply [![NPM Module](https://img.shields.io/npm/v/deeply.svg?style=flat)](https://www.npmjs.com/package/deeply)

A library that deeply merges properties of the provided objects, returns untangled copy (clone). Mutable operations also available.

[![PhantomJS Build](https://img.shields.io/travis/alexindigo/deeply/master.svg?label=browser&style=flat)](https://travis-ci.org/alexindigo/deeply)
[![Linux Build](https://img.shields.io/travis/alexindigo/deeply/master.svg?label=linux:0.10-5.x&style=flat)](https://travis-ci.org/alexindigo/deeply)
[![Windows Build](https://img.shields.io/appveyor/ci/alexindigo/deeply/master.svg?label=windows:0.10-5.x&style=flat)](https://ci.appveyor.com/project/alexindigo/deeply)

[![Coverage Status](https://img.shields.io/coveralls/alexindigo/deeply/master.svg?label=code+coverage&style=flat)](https://coveralls.io/github/alexindigo/deeply?branch=master)
[![Dependency Status](https://img.shields.io/david/alexindigo/deeply.svg?style=flat)](https://david-dm.org/alexindigo/deeply)
[![bitHound Overall Score](https://www.bithound.io/github/alexindigo/deeply/badges/score.svg)](https://www.bithound.io/github/alexindigo/deeply)

![Readme](https://img.shields.io/badge/readme-tested-brightgreen.svg?style=flat)

## TL;DR

Deeply is a toolkit for deep structure manipulations, providing deep merge/clone functionality out of the box,
and allowing to extended/custom functionality for more control and greater flexibility.

## Install

> Version `1.0.0` backwards compatible with `0.1.0` version.

```
$ npm install deeply --save
```

## Examples

### merge
– Deeply merges two or more objects.

```javascript
var merge = require('deeply');

var result = merge({a: {a1: 1}}, {a: {a2: 2}});

assert.equal(result, {a: {a1: 1, a2: 2}});
```

### clone
– As degenerated case of merging one object on itself, it's possible to use deeply as deep clone function.

```javascript
var merge = require('deeply');
var clone = merge;

var x = {a: {b: {c: 1}}};
var y = clone(x);

y.a.b.c = 2;

assert.equal(x.a.b.c, 1);
```

### arrays custom merging
– By default array treated as primitive values and being replaced upon conflict,
for more meaningful array merge strategy, provide one of the pre-built array merge helpers
or a custom reduce function within invocation context.

#### default behavior

```javascript
var merge = require('deeply');
var result = merge({ a: { b: [0, 2, 4, {a: 'A'}], c: 'first' }}, { a: {b: [1, 3, 5, {b: 'B'}], d: 'second' }});

assert.equal(result, { a: { b: [1, 3, 5, {b: 'B'}], c: 'first', d: 'second' }});
```

#### combining arrays

```javascript
var merge = require('deeply');
var result;

var context =
{
  useCustomAdapters: merge.behaviors.useCustomAdapters,
  'array'          : merge.adapters.arraysCombine
};

// it might be useful when you have array of objects
result = merge.call(context, { a: { b: [0, {a: 'A1', b: 'B1'}, 4] }}, { a: {b: [1, {a: 'A2', c: 'C2'}, 5] }});
assert.equal(result, { a: { b: [1, {a: 'A2', b: 'B1', c: 'C2'}, 5] }});
```

#### appending arrays

```javascript
var merge = require('deeply');

var context =
{
  useCustomAdapters: merge.behaviors.useCustomAdapters,
  'array'          : merge.adapters.arraysAppend
};

var result = merge.call(context, { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: {b: [1, 3, 5, 5, 3, 1] }});

assert.equal(result, { a: { b: [0, 2, 4, 4, 2, 0, 1, 3, 5, 5, 3, 1] }});
```

#### appending arrays and keeping unique elements only

```javascript
var merge = require('deeply');

var context =
{
  useCustomAdapters: merge.behaviors.useCustomAdapters,
  'array'          : merge.adapters.arraysAppendUnique
};

var result = merge.call(context, { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: {b: [1, 3, 5, 5, 3, 1] }});

assert.equal(result, { a: { b: [0, 2, 4, 1, 3, 5] }});
```

#### custom merge function

For example we need to have merging arrays to be appended,
with only unique elements and sort the result array.

```javascript
var merge = require('deeply');

var context =
{
  useCustomAdapters: merge.behaviors.useCustomAdapters,
  'array'          : appendUniqueAndSort
};

var result = merge.call(context, { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: {b: [1, 3, 5, 5, 3, 1] }});

assert.equal(result, { a: { b: [0, 1, 2, 3, 4, 5] }});

// Custom array adapter
function appendUniqueAndSort(to, from, merge)
{
  // append only if new element isn't present yet
  from.forEach(function(v) { to.indexOf(v) == -1 && to.push(merge(undefined, v)); });

  // and sort
  return to.sort();
}
```

### merging functions

By default, functions copied as is to the result object,
basically being treated as primitive values.

You can use `functionsClone` adapter to achieve something like this:

```javascript
var clone = require('deeply');

function subj(a, b)
{
  return a + b + 10;
}

subj.customProp = 13;

subj.prototype.A = 1;

subj.prototype.B = {isB: 'true'};

var context =
{
  useCustomAdapters: clone.behaviors.useCustomAdapters,
  'function'       : clone.adapters.functionsClone
};

var result = clone.call(context, { a: { b: subj}});

// cloned object function named subj
assert.equal(result, { a: { b: subj}});

// same signature
assert.equal(subj.name, result.a.b.name);
assert.equal(subj.length, result.a.b.length);

assert.equal(subj.customProp, result.a.b.customProp);

// separate objects
subj.isOriginal = true;
result.a.b.isCopy = true;

assert.equal(subj.isOriginal, true);
assert.equal(subj.isCopy, undefined);

assert.equal(result.a.b.isOriginal, undefined);
assert.equal(result.a.b.isCopy, true);

// same output
assert.equal(subj(3, 4), result.a.b(3, 4));
```

In case you  care about prototype objects, it will work too.

```javascript
var clone = require('deeply');

function Subj()
{
  this.boom = 'Zap!';
}

Subj.prototype.A = 1;

Subj.prototype.B = {isB: 'true'};

var context =
{
  useCustomAdapters: clone.behaviors.useCustomAdapters,
  'function'       : clone.adapters.functionsClone
};

var result = clone.call(context, { class: Subj });

// cloned object function named Subj
assert.equal(result, { class: function Subj(){} });

// has prototype properties
assert.equal(result.class.prototype.A, 1);
assert.equal(result.class.prototype.B.isB, 'true');

// prototypes are decoupled
Subj.prototype.C = 2;
assert.equal(Subj.prototype.C, 2);
assert.equal(result.class.prototype.C, undefined);

// instances  
var s1 = new Subj();
var s2 = new result.class();

assert.equal(s1.A, s2.A);
assert.equal(s1.B, s2.B);

assert.equal(s1.C, 2);
assert.equal(s2.C, undefined);

assert.equal(s1.boom, s2.boom);

// but reported instanceof isn't the same
assert.equal(s1 instanceof Subj, true);
assert.equal(s2 instanceof Subj, false);

```


### mutable operations

```javascript
var merge = require('deeply/mutable');
var myObj = {a: {a1: 1, a2: 2}, b: {b1: 11, b2: 12}};

merge(myObj, {c: 'c', d: 'd'}, {x: {y: {z: -Infinity}}});

assert.equal(myObj, {a: {a1: 1, a2: 2}, b: {b1: 11, b2: 12}, c: 'c', d: 'd', x: {y: {z: -Infinity}}});
```

More examples can be found in ```test/index.js```.

## License

Deeply is licensed under the MIT license.
