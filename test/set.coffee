expect = require("chai").expect
Set    = require("../index").Set
Map    = require("../index").Map

describe "Set", ->
  set = null
  things = [null, undefined, 0, 1, true, false, "", "str", {}, new Object, [], new Array, (->), new Function, /regex/, new RegExp, new Date]
  beforeEach -> set = new Set()

  it "allows add and check existence", ->
    things.forEach (thing) -> 
      expect(set.has(thing)).to.be.false
      set.add(thing)
      expect(set.has(thing)).to.be.true
    expect(set.all().length).to.equal(things.length) 

  it "does not allow duplicates", ->
    things.forEach (thing, index) -> 
      set.add(thing) for i in [0...10]
      expect(set.all().length).to.equal(index+1)

  it "allows delete things", ->
    things.forEach (thing) -> 
      expect(set.has(thing)).to.be.false
      set.add(thing)
      set.del(thing)
      expect(set.has(thing)).to.be.false
    expect(set.all().length).to.equal(0) 

  it "does not need more tests because really I", -> expect(set.map).to.be.an.instanceof(Map)