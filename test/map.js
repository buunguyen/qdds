(function() {
  var Map, expect;

  expect = require("chai").expect;

  Map = require("../index").Map;

  describe("Map", function() {
    var kv_pairs, map;
    map = null;
    kv_pairs = [[{}, {}], [{}, []], [{}, (function() {})], [{}, /regex/], [{}, new Date], [{}, 42], [{}, 42.5], [{}, true], [{}, false], [{}, ""], [{}, "str"], [{}, null], [{}, void 0]];
    beforeEach(function() {
      return map = new Map();
    });
    it("does not allow primitive keys (use native JS hash instead will ya)", function() {
      return [0, 42, 42.5, "", "str", true, false].forEach(function(k) {
        return expect(function() {
          return map.set(k);
        }).to["throw"](TypeError);
      });
    });
    it("does not allow null or undefined keys", function() {
      return [null, void 0].forEach(function(k) {
        return expect(function() {
          return map.set(k);
        }).to["throw"](TypeError);
      });
    });
    it("is extensible via custom hash strategy (for example, extend to support primitive types)", function() {
      var hashFn;
      hashFn = function(k) {
        return k;
      };
      map = new Map(hashFn);
      map.set(1, 2);
      return expect(map.get(1)).to.equal(2);
    });
    it("allows object keys", function() {
      return [{}, new Object, (function() {}), new Function, /regex/, new RegExp, new Date, [], new Array].forEach(function(k) {
        return expect(function() {
          return map.set(k);
        }).not.to["throw"](TypeError);
      });
    });
    it("allows sets key, value and gets value by key", function() {
      return kv_pairs.forEach(function(_arg) {
        var k, v;
        k = _arg[0], v = _arg[1];
        map.set(k, v);
        return expect(map.get(k)).to.equal(v);
      });
    });
    it("throws if key isn't found", function() {
      return expect(function() {
        return map.get({});
      }).to["throw"](Error);
    });
    it("checks if key exists", function() {
      return kv_pairs.forEach(function(_arg) {
        var k, v;
        k = _arg[0], v = _arg[1];
        expect(map.has(k)).to.be["false"];
        map.set(k, v);
        return expect(map.has(k)).to.be["true"];
      });
    });
    it("deletes keys", function() {
      return kv_pairs.forEach(function(_arg) {
        var k, res, v;
        k = _arg[0], v = _arg[1];
        expect(map.has(k)).to.be["false"];
        map.set(k, v);
        res = map.del(k);
        expect(map.has(k)).to.be["false"];
        expect(res[0]).to.equal(k);
        return expect(res[1]).to.equal(v);
      });
    });
    return it("retrieves all keys", function() {
      var ks;
      kv_pairs.forEach(function(_arg) {
        var k, v;
        k = _arg[0], v = _arg[1];
        return map.set(k, v);
      });
      ks = kv_pairs.map(function(_arg) {
        var k, v;
        k = _arg[0], v = _arg[1];
        return k;
      });
      return expect(map.keys().length).to.equal(ks.length);
    });
  });

}).call(this);
