types = ["Array", "Function", "String", "Number", "Boolean", "RegExp", "Date"]
template = `(function is$(o) { return Object.prototype.toString.call(o) === '[object $]' }).toString()`
eval(template.replace(/\$/g, types[i])) for i in [0...types.length] 

quickdirty = ->
  next = 1
  hash  : (k) -> 
    return Object::toString.call(k) if not k?
    return k if isString(k)
    return k.toString() if isNumber(k) or isBoolean(k) or isRegExp(k) or isDate(k)
    return k.$hash ?= next++
  equal : (k1, k2) -> k1 is k2

class Map
  constructor : (@strategy=quickdirty()) -> @_buckets={}
  has  : (k) -> try @get(k); true catch then false
  get  : (k) ->
    return v for [_k, v] in (@_buckets[@strategy.hash k] or []) when @strategy.equal(_k, k)
    throw new Error()
  set  : (k, v) ->
    bucket = @_buckets[@strategy.hash k] ?= []
    return entry[1] = v for entry in bucket when @strategy.equal(entry[0], k)
    bucket.push([k, v])
  del  : (k) -> 
    return bucket.splice(index, 1)[0] for [_k, v], index in (bucket = @_buckets[@strategy.hash k] or []) when @strategy.equal(_k, k)
  keys : ()  -> 
    keys = []
    keys = keys.concat(k for [k, v] in bucket) for h, bucket of @_buckets
    keys
  all  : () ->
    pairs = []
    pairs = pairs.concat(bucket) for h, bucket of @_buckets
    pairs

class Set
  constructor : (strategy=quickdirty()) -> @map = new Map(strategy)
  has : (obj) -> @map.has obj
  add : (obj) -> @map.set obj
  del : (obj) -> @map.del obj
  all : ()    -> @map.keys()

["every", "filter", "find", "forEach", "map", "reduce", "reduceRight", "some"].forEach (fn) -> 
  if isFunction(Array::[fn])
    Map::[fn] = Set::[fn] = -> Array::[fn].apply(@all(), arguments)

global = if (typeof module isnt 'undefined' and module.exports) then module.exports else window
global.Map = Map
global.Set = Set