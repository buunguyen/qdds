(function() {
  var Set, expect;

  expect = require("chai").expect;

  Set = require("../index").Set;

  describe("Set", function() {
    var objs, set;
    set = null;
    objs = [{}, new Object, [], new Array, (function() {}), new Function, /regex/, new RegExp, new Date];
    beforeEach(function() {
      return set = new Set();
    });
    it("allows add objects and check existence", function() {
      objs.forEach(function(obj) {
        expect(set.has(obj)).to.be["false"];
        set.add(obj);
        return expect(set.has(obj)).to.be["true"];
      });
      return expect(set.all().length).to.equal(objs.length);
    });
    it("does not allow duplicates", function() {
      var i, obj, _i, _results;
      obj = {};
      _results = [];
      for (i = _i = 0; _i < 10; i = ++_i) {
        set.add(obj);
        _results.push(expect(set.all().length).to.equal(1));
      }
      return _results;
    });
    return it("allows delete objects", function() {
      objs.forEach(function(obj) {
        expect(set.has(obj)).to.be["false"];
        set.add(obj);
        set.del(obj);
        return expect(set.has(obj)).to.be["false"];
      });
      return expect(set.all().length).to.equal(0);
    });
  });

}).call(this);
