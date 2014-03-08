expect = require("chai").expect
Map    = require("../index").Map

describe "Map", ->
  map = null
  kv_pairs = [
    [{}, {}], [{}, []], [{}, (->)], [{}, /regex/], [{}, new Date],
    [{}, 42], [{}, 42.5], [{}, true], [{}, false], [{}, ""], [{}, "str"]
    [{}, null], [{}, undefined]
  ]
  beforeEach -> map = new Map()

  it "does not allow primitive keys (use native JS hash instead will ya)", -> 
    [0, 42, 42.5, "", "str", true, false].forEach (k) -> 
      expect(-> map.set(k)).to.throw(TypeError)

  it "does not allow null or undefined keys", -> 
    [null, undefined].forEach (k) -> 
      expect(-> map.set(k)).to.throw(TypeError)

  it "is extensible via custom hash strategy (for example, extend to support primitive types)", -> 
    hashFn = (k) -> k # for testing only, not your cutting-edge hash algorithm
    map = new Map(hashFn)
    map.set(1, 2)
    expect(map.get(1)).to.equal(2)

  it "allows object keys", -> 
    [{}, new Object, (->), new Function, /regex/, new RegExp, new Date, [], new Array].forEach (k) -> 
      expect(-> map.set(k)).not.to.throw(TypeError)

  it "allows sets key, value and gets value by key", ->
    kv_pairs.forEach ([k, v]) -> 
      map.set(k, v)
      expect(map.get(k)).to.equal(v)

  it "throws if key isn't found", ->
    expect(-> map.get({})).to.throw(Error)

  it "checks if key exists", ->
    kv_pairs.forEach ([k, v]) -> 
      expect(map.has(k)).to.be.false
      map.set(k, v)
      expect(map.has(k)).to.be.true

  it "deletes keys", ->
    kv_pairs.forEach ([k, v]) -> 
      expect(map.has(k)).to.be.false
      map.set(k, v)
      res = map.del(k)
      expect(map.has(k)).to.be.false
      expect(res[0]).to.equal(k)
      expect(res[1]).to.equal(v)

  it "retrieves all keys", ->
    kv_pairs.forEach ([k, v]) -> map.set(k, v)
    ks = kv_pairs.map(([k, v]) -> k)
    expect(map.keys().length).to.equal(ks.length)