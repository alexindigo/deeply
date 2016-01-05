# Deeply [![NPM Module](https://img.shields.io/npm/v/deeply.svg)](https://www.npmjs.com/package/deeply)

Universal (nodejs + browser) library that deeply merges properties of the provided objects, returns untangled copy (clone). Mutable operations also available.

[![Linux Build](https://img.shields.io/travis/alexindigo/deeply/master.svg?label=linux:0.10-5.x)](https://travis-ci.org/alexindigo/deeply)
[![Windows Build](https://img.shields.io/appveyor/ci/alexindigo/deeply/master.svg?label=windows:0.10-5.x)](https://ci.appveyor.com/project/alexindigo/deeply)
[![Coverage Status](https://img.shields.io/coveralls/alexindigo/deeply/master.svg?label=code+coverage)](https://coveralls.io/github/alexindigo/deeply?branch=master)

[![Dependency Status](https://img.shields.io/david/alexindigo/deeply.svg)](https://david-dm.org/alexindigo/deeply)
[![Codacy Badge](https://img.shields.io/codacy/5f1289b78b7346498797f9f3cd674408.svg)](https://www.codacy.com/app/alexindigo/deeply)
[![bitHound Overall Score](https://www.bithound.io/github/alexindigo/deeply/badges/score.svg)](https://www.bithound.io/github/alexindigo/deeply)

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

merge({a: {a1: 1}}, {a: {a2: 2}}); // -> {a: {a1: 1, a2: 2}}
```

### clone
– As degenerated case of merging one object on itself, it's possible to use deeply as deep clone function.

```javascript
var merge = require('deeply');
var clone = merge;

var x = {a: {b: {c: 1}}};
var y = clone(x);

y.a.b.c = 2;

console.log(x.a.b.c); // -> 1
```

### arrays custom merging
– By default array treated as primitive values and being replaced upon conflict, for more meaningful array merge strategy, provide custom reduce function as last argument.

```javascript
var merge = require('deeply');

// default behavior

merge({ a: { b: [0, 2, 4] }}, { a: {b: [1, 3, 5] }}); // -> { a: { b: [1, 3, 5] }}

// custom merge function

function customMerge(a, b)
{
  return (a||[]).concat(b);
}

merge({ a: { b: [0, 2, 4] }}, { a: {b: [1, 3, 5] }}, customMerge); // -> { a: { b: [0, 2, 4, 1, 3, 5] }}
```

### mutable operations

```javascript
var merge = require('deeply/mutable');
var myObj = {a: {a1: 1, a2: 2}, b: {b1: 11, b2: 12}};

merge(myObj, {c: 'c', d: 'd'}, {x: {y: {z: -Infinity}}});

console.log(myObj); // -> {a: {a1: 1, a2: 2}, b: {b1: 11, b2: 12}, c: 'c', d: 'd', x: {y: {z: -Infinity}}}
```

More examples can be found in ```test/index.js```.

## License

Deeply is licensed under the MIT license.