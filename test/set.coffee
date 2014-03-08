expect = require("chai").expect
Set    = require("../index").Set

describe "Set", ->
  set = null
  objs = [{}, new Object, [], new Array, (->), new Function, /regex/, new RegExp, new Date]
  beforeEach -> set = new Set()

  it "allows add objects and check existence", ->
    objs.forEach (obj) -> 
      expect(set.has(obj)).to.be.false
      set.add(obj)
      expect(set.has(obj)).to.be.true
    expect(set.all().length).to.equal(objs.length) 

  it "does not allow duplicates", ->
    obj = {}
    for i in [0...10]
      set.add(obj)
      expect(set.all().length).to.equal(1)

  it "allows delete objects", ->
    objs.forEach (obj) -> 
      expect(set.has(obj)).to.be.false
      set.add(obj)
      set.del(obj)
      expect(set.has(obj)).to.be.false
    expect(set.all().length).to.equal(0) 