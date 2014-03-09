(function() {
  var Map, Set, expect;

  expect = require("chai").expect;

  Set = require("../index").Set;

  Map = require("../index").Map;

  describe("Set", function() {
    var set, things;
    set = null;
    things = [null, void 0, 0, 1, true, false, "", "str", {}, new Object, [], new Array, (function() {}), new Function, /regex/, new RegExp, new Date];
    beforeEach(function() {
      return set = new Set();
    });
    it("allows add and check existence", function() {
      things.forEach(function(thing) {
        expect(set.has(thing)).to.be["false"];
        set.add(thing);
        return expect(set.has(thing)).to.be["true"];
      });
      return expect(set.all().length).to.equal(things.length);
    });
    it("does not allow duplicates", function() {
      return things.forEach(function(thing, index) {
        var i, _i;
        for (i = _i = 0; _i < 10; i = ++_i) {
          set.add(thing);
        }
        return expect(set.all().length).to.equal(index + 1);
      });
    });
    it("allows delete things", function() {
      things.forEach(function(thing) {
        expect(set.has(thing)).to.be["false"];
        set.add(thing);
        set.del(thing);
        return expect(set.has(thing)).to.be["false"];
      });
      return expect(set.all().length).to.equal(0);
    });
    return it("does not need more tests because really I", function() {
      return expect(set.map).to.be.an["instanceof"](Map);
    });
  });

}).call(this);
