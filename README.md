### What
Quick & dirty map and set data structures to use while waiting for ECMAScript 6 (and its new data structures) to be widely available.

Most of the time, native hashes (i.e. which support string keys only) are what you need. Only use this library if you deal with non-string keys. `Map` doesn't support primitive types, unless a custom hash strategy is supplied to its constructor. `Set` is built on top of `Map`, so it by default doesn't support primitive types either. Yes, it's indeed quick & dirty (~30 lines of CoffeeScript).

### Install
```
npm install a
```
```
bower install a
```

### Usage
```javascript
map = new Map
map.set(k, v)
map.get(k)
map.has(k)
map.del(k)
map.keys()

set = new Set
set.add(obj)
set.has(obj)
set.del(obj)
set.all()
```

#### Extend hash strategy
```javascript
map = new Map(customHashFn)
set = new Set(customHashFn)
```