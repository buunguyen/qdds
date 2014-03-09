expect = require("chai").expect
Map    = require("../index").Map

describe "Map", ->
  map = null
  primitive_keys = [0, 1, 42, 42.5, "", "str", true, false]
  non_primitive_keys = [null, undefined, {}, new Object, (->), new Function, /regexp/, new RegExp, new Date, [], new Array]
  all_keys = primitive_keys.concat(non_primitive_keys)
  all_vals = [{}, [], (->), /regexp/, new Date, 42, 42.5, true, false, "", "str", null, undefined]
  all_pairs = []
  for key in all_keys
    for val in all_vals
      all_pairs.push([key, val])

  beforeEach -> map = new Map()

  it "throws if key isn't found", ->
    all_keys.forEach (k) ->
      expect(-> map.get(k)).to.throw(Error)

  describe "primitives", ->
    it "allows primitive keys", -> 
      primitive_keys.forEach (k) -> 
        map.set(k, k)
        expect(map.get(k)).to.equal(k)

    it "retrieves value for 'same' primitives", ->
      [[0, 0], [1, 1], [1.5, 1.5], ["", ""], ["1", "1"], [true, true], [false, false]].forEach ([k1, k2]) ->
        val = {}
        map.set(k1, val)
        expect(map.get(k2)).to.equal(val)

  describe "non-primitives", ->
    it "allows non-primitive keys", -> 
      non_primitive_keys.forEach (k) -> 
        map.set(k, k)
        expect(map.get(k)).to.equal(k)

    it "treats all objects differently", -> 
      map.set({})
      expect(-> map.get({})).to.throw(Error)

    it "compares objects by identity", -> 
      map.set($hash: 1)
      expect(-> map.get($hash: 1)).to.throw(Error)

  describe "existance", ->
    it "checks key exists", ->
      all_keys.forEach (k) -> 
        expect(map.has(k)).to.be.false
        map.set(k)
        expect(map.has(k)).to.be.true

    it "overrides value if a key is added more than once", ->
      all_keys.forEach (k) -> 
        map.set(k, 1)
        map.set(k, 2)
        expect(map.get(k)).to.equal(2)

  describe "all", ->
    it "works for all types of values", ->
      all_pairs.forEach ([k, v]) -> 
        expect(map.has(k)).to.be.false

        map.set(k, v)
        expect(map.has(k)).to.be.true
        expect(map.get(k)).to.equal(v)

        res = map.del(k)
        expect(map.has(k)).to.be.false
        expect(res[0]).to.equal(k)
        expect(res[1]).to.equal(v)

    it "retrieves all keys", ->
      all_keys.forEach (k) -> map.set(k)
      expect(map.keys().length).to.equal(all_keys.length)
      expect(map.all().length).to.equal(all_keys.length)

  describe "Array methods", ->
    beforeEach -> all_keys.forEach (k) -> map.set(k)

    it "supports forEach()", ->
      map.forEach ([k, v]) -> expect(all_keys).to.include.members([k])

    it "supports map()", ->
      map.map ([k, v]) -> expect(all_keys).to.include.members([k])

    it "supports reduce()", ->
      map.reduce (_, [k, v]) -> expect(all_keys).to.include.members([k])

    it "supports other methods, but I'm lazy...", ->

  describe "extensibility", ->    
    it "allows custom strategy", -> 
      java_like_strategy = # just the idea, of course
        hash  : (k)      -> k.hashCode()
        equal : (k1, k2) -> k1.equals(k2)
      preferences = new Map(java_like_strategy)
      class Person
        constructor: (@name, @age) ->
        hashCode   : -> return @name + @age # something like that, doh!
        equals     : (other) -> @name is other.name and @age is other.age
      lang_prefs = languages: ["coffee", "js"]
      p1 = new Person "guy", 30
      p2 = new Person "guy", 30
      preferences.set(p1, lang_prefs)
      expect(preferences.get(p2)).to.equal(lang_prefs)