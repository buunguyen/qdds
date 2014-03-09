### What
JavaScript hashes are great, but they don't support non-string keys. And while there's `Array`, there's no `Set` data structure. ECMAScript 6 will rectify these. But until it's widely available, let's use some temporary stuff.

### Install
```
npm install qdds
```
```
bower install qdds
```

### Usages
#### Map
```javascript
map = new Map
map.set(k, v)
map.get(k) // throw Error if k doesn't exist
map.has(k)
map.del(k)
map.all()  // all [k, v] pairs
map.keys() // all keys
```

#### Set
```javascript
set = new Set
set.add(obj)
set.has(obj)
set.del(obj)
set.all()
```

#### More methods
These methods are also available for both `Map` and `Set`: `every`, `filter`, `find`, `forEach`, `map`, `reduce`, `reduceRight`, `some`. This works by calling to the corresponding method of `Array`, if one exists.

### Extension
The default strategy does not require you to implement any sort of `hashCode()` or `equals()` methods, like in Java or C#. It just works, in its quick & dirty way. 

If you ever need more than the default algorithm, you can extend both `Map` and `Set` by supplying an object with two methods: `hash(k)` and `equal(k)`. 

```javascript
map = new Map(customStrategy)
set = new Set(customStrategy)
```

For example, this example (extracted from the tests) shows a super trivial Java/C# like algorithm. This is just to give you an idea, don't use it.

```coffeescript
java_like_strategy = 
  hash  : (k)      -> k.hashCode()
  equal : (k1, k2) -> k1.equals(k2)
preferences = new Map(java_like_strategy)

class Person
  constructor: (@name, @age) ->
  hashCode   : ->         @name + @age
  equals     : (other) -> @name is other.name and @age is other.age

lang_prefs = languages: ["coffee", "js"]
p1 = new Person "guy", 30
p2 = new Person "guy", 30
preferences.set(p1, lang_prefs)
expect(preferences.get(p2)).to.equal(lang_prefs)
```