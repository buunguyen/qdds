next = 1
qhash = (k) -> 
  throw new TypeError() if (not k?) or ((typeof k isnt "object") and (typeof k isnt "function"))
  k.$hash ?= next++ 

class Map
  constructor : (@hash=qhash) -> @_buckets={}
  has  : (k) -> try @get(k); true catch then false
  get  : (k) -> 
    return v for [_k, v] in (@_buckets[@hash k] or []) when _k is k
    throw new Error()
  set  : (k, v) ->
    bucket = @_buckets[@hash k] ?= []
    return entry[1] = v for entry in bucket when entry[0] is k
    bucket.push([k, v])
  del  : (k) -> 
    return bucket.splice(index, 1)[0] for [_k, v], index in (bucket = @_buckets[@hash k] or []) when _k is k
  keys : ()  -> 
    _keys = []
    _keys = _keys.concat(k for [k, v] in bucket) for h, bucket of @_buckets
    _keys

class Set
  constructor : (hash=qhash) -> @_qdh = new Map(hash)
  has : (obj) -> @_qdh.has obj
  add : (obj) -> @_qdh.set obj
  del : (obj) -> @_qdh.del obj
  all : ()    -> @_qdh.keys()
["forEach", "map", "reduce"].forEach (fn) -> Set::[fn] = -> Array::[fn].apply(@all(), arguments)

global = if (typeof module isnt 'undefined' and module.exports) then module.exports else window
global.Map = Map
global.Set = Set