# Deeply [![NPM Module](https://img.shields.io/npm/v/deeply.svg?style=flat)](https://www.npmjs.com/package/deeply)

A toolkit for deep structure manipulations, provides deep merge/clone functionality out of the box,
and exposes hooks and custom adapters for more control and greater flexibility.

[![PhantomJS Build](https://img.shields.io/travis/alexindigo/deeply/master.svg?label=browser&style=flat)](https://travis-ci.org/alexindigo/deeply)
[![Linux Build](https://img.shields.io/travis/alexindigo/deeply/master.svg?label=linux:0.10-6.x&style=flat)](https://travis-ci.org/alexindigo/deeply)
[![Windows Build](https://img.shields.io/appveyor/ci/alexindigo/deeply/master.svg?label=windows:0.10-6.x&style=flat)](https://ci.appveyor.com/project/alexindigo/deeply)

[![Coverage Status](https://img.shields.io/coveralls/alexindigo/deeply/master.svg?label=code+coverage&style=flat)](https://coveralls.io/github/alexindigo/deeply?branch=master)
[![Dependency Status](https://img.shields.io/david/alexindigo/deeply.svg?style=flat)](https://david-dm.org/alexindigo/deeply)
[![bitHound Overall Score](https://www.bithound.io/github/alexindigo/deeply/badges/score.svg)](https://www.bithound.io/github/alexindigo/deeply)

[![Readme](https://img.shields.io/badge/readme-tested-brightgreen.svg?style=flat)](https://www.npmjs.com/package/reamde)

| compression      |    size |
| :--------------- | ------: |
| deeply.js        | 15.1 kB |
| deeply.min.js    | 4.98 kB |
| deeply.min.js.gz | 1.51 kB |


## Table of Contents

<!-- TOC -->
- [Install](#install)
- [Examples](#examples)
  - [Merging](#merging)
  - [Cloning](#cloning)
  - [Arrays Custom Merging](#arrays-custom-merging)
    - [Default Behavior](#default-behavior)
    - [Combining Arrays](#combining-arrays)
    - [Appending Arrays](#appending-arrays)
    - [Appending Arrays and Keeping Unique Elements Only](#appending-arrays-and-keeping-unique-elements-only)
    - [Custom Merge Function](#custom-merge-function)
  - [Cloning Functions](#cloning-functions)
    - [Cloning Prototype Chain](#cloning-prototype-chain)
    - [Extend Original Function Prototype](#extend-original-function-prototype)
  - [Custom hooks](#custom-hooks)
  - [Mutable Operations](#mutable-operations)
  - [Ludicrous Mode](#ludicrous-mode)
- [Want to Know More?](#want-to-know-more)
- [License](#license)

<!-- TOC END -->

## Install

```sh
$ npm install deeply --save
```

## Examples

By default it provides interface for immutable operations,
also available via explicit require `require('deeply/immutable')`
or `require('deeply').immutable` property.

### Merging

Deeply merges two or more objects.

```javascript
var merge = require('deeply');

var result = merge({a: {a1: 1}}, {a: {a2: 2}}, {b: {b3: 3}});

assert.equal(result, {a: {a1: 1, a2: 2}, b: {b3: 3}});
```

### Cloning

As degenerated case of merging one object on itself, it's possible to use deeply as deep clone function.

```javascript
var merge = require('deeply');
var clone = merge;

var x = {a: {b: {c: 1}}};
var y = clone(x);

y.a.b.c = 2;

assert.equal(x.a.b.c, 1);
```

### Arrays Custom Merging

By default array treated as primitive values and being replaced upon conflict,
for more meaningful array merge strategy, provide one of the pre-built array merge helpers
or a custom reduce function within invocation context.

#### Default Behavior

```javascript
var merge = require('deeply');
var result = merge({ a: { b: [0, 2, 4, {a: 'A'}], c: 'first' }}, { a: {b: [1, 3, 5, {b: 'B'}], d: 'second' }});

assert.equal(result, { a: { b: [1, 3, 5, {b: 'B'}], c: 'first', d: 'second' }});
```

#### Combining Arrays

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

#### Appending Arrays

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

#### Appending Arrays and Keeping Unique Elements Only

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

#### Custom Merge Function

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

### Cloning Functions

By default, functions copied as is to the result object,
basically being treated as primitive values.

You can use `functionsClone` adapter to clone functions,
creating new function object with the same signature as original.

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

#### Cloning Prototype Chain

It will also clone prototype objects,
so use this option with caution.

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
assert.equal(result, { class: Subj });

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

#### Extend Original Function Prototype

When having proper `instanceof` results matters,
you can use `functionsExtend` helper instead.

```javascript
var clone = require('deeply');

function Subj()
{
  this.boom = 'Zap!';
  return this.boom;
}

Subj.customProp = 13;

Subj.prototype.A = 1;

Subj.prototype.B = {isB: 'true'};

var context =
{
  useCustomAdapters: clone.behaviors.useCustomAdapters,
  'function'       : clone.adapters.functionsExtend
};

var result = clone.call(context, { class: Subj });

// cloned object function named Subj
assert.equal(result, { class: Subj });

// same signature
assert.equal(Subj.name, result.class.name);
assert.equal(Subj.length, result.class.length);

assert.equal(Subj.customProp, result.class.customProp);

// separate objects
Subj.isOriginal = true;
result.class.isCopy = true;

assert.equal(Subj.isOriginal, true);
assert.equal(Subj.isCopy, undefined);

assert.equal(result.class.isOriginal, undefined);
assert.equal(result.class.isCopy, true);

// same output
assert.equal(Subj(), result.class());

// has prototype properties
assert.equal(result.class.prototype.A, 1);
assert.equal(result.class.prototype.B.isB, 'true');

// prototypes are extended
Subj.prototype.X = 67;
assert.equal(Subj.prototype.X, 67);
assert.equal(result.class.prototype.X, 67);

// instances  
var s1 = new Subj();
var s2 = new result.class();

assert.equal(s1.A, s2.A);
assert.equal(s1.B, s2.B);

assert.equal(s1.boom, s2.boom);

// but reported instanceof isn't the same
assert.equal(s1 instanceof Subj, true);
assert.equal(s2 instanceof Subj, true);
```

### Custom hooks

As shown in [Custom Merge Function](#custom-merge-function) example,
you can add custom adapters for any data type
that supported by [precise-typeof](https://www.npmjs.com/precise-typeof).

For this example we will combine arrays of number,
by performing addition operation on array elements.

```javascript
var merge = require('deeply');

var context =
{
  useCustomAdapters: merge.behaviors.useCustomAdapters,
  'array'          : merge.adapters.arraysCombine,
  'number'         : addNumbers
};

var result = merge.call(context, { a: { b: [0, 2, 4, 4, 2, 0] }}, { a: {b: [1, 3, 5, 5, 3, 1] }}, { a: {b: [7, 8, 9, 10, 11, 12] }});

assert.equal(result, { a: { b: [8, 13, 18, 19, 16, 13] }});

// Custom number adapter
function addNumbers(to, from)
{
  return (to || 0) + from;
}
```

### Mutable Operations

Mutable interface supports all the described operations,
and available via explicit require `require('deeply/mutable')`
or `require('deeply').mutable` property.

```javascript
var merge = require('deeply/mutable');
var myObj = {a: {a1: 1, a2: 2}, b: {b1: 11, b2: 12}};

merge(myObj, {c: 'c', d: 'd'}, {x: {y: {z: -Infinity}}});

assert.equal(myObj, {a: {a1: 1, a2: 2}, b: {b1: 11, b2: 12}, c: 'c', d: 'd', x: {y: {z: -Infinity}}});
```

### Ludicrous Mode

Also as shortcut and a homage to Tesla, ludicrous mode is available,
that will clone functions and it's prototype objects by default. :)
Details could be found in [Cloning Functions](#cloning-functions) examples.

```javascript
var ludicrous = require('deeply/ludicrous');
var scopeVar = 6;

function original(a, b)
{
  return a + b + scopeVar;
}

var cloned = ludicrous({ func: original });

// cloned object function named subj
assert.equal(cloned, { func: original });

// same signature
assert.equal(original.name, cloned.func.name);
assert.equal(original.length, cloned.func.length);

// separate objects
original.isOriginal = true;
cloned.func.isCopy = true;

assert.equal(original.isOriginal, true);
assert.equal(original.isCopy, undefined);

assert.equal(cloned.func.isOriginal, undefined);
assert.equal(cloned.func.isCopy, true);

// same output
assert.equal(original(1, 2), cloned.func(1, 2));
```

_Note: `ludicrous` isn't included into the main `deeply` package, so it won't be automatically pulled in,
if you're bundling using `browserify deeply/index.js`, to use ludicrous in the browser you'd need to explicitly
require it in your modules or specify direct path in your bundler config._

## Want to Know More?

More examples can be found in [test/compatability.js](test/compatability.js).

Or open an [issue](https://github.com/alexindigo/deeply/issues) with questions and/or suggestions.

## License

Deeply is released under the [MIT](LICENSE) license.
