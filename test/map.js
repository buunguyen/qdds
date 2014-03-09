(function() {
  var Map, expect;

  expect = require("chai").expect;

  Map = require("../index").Map;

  describe("Map", function() {
    var all_keys, all_pairs, all_vals, key, map, non_primitive_keys, primitive_keys, val, _i, _j, _len, _len1;
    map = null;
    primitive_keys = [0, 1, 42, 42.5, "", "str", true, false];
    non_primitive_keys = [null, void 0, {}, new Object, (function() {}), new Function, /regexp/, new RegExp, new Date, [], new Array];
    all_keys = primitive_keys.concat(non_primitive_keys);
    all_vals = [{}, [], (function() {}), /regexp/, new Date, 42, 42.5, true, false, "", "str", null, void 0];
    all_pairs = [];
    for (_i = 0, _len = all_keys.length; _i < _len; _i++) {
      key = all_keys[_i];
      for (_j = 0, _len1 = all_vals.length; _j < _len1; _j++) {
        val = all_vals[_j];
        all_pairs.push([key, val]);
      }
    }
    beforeEach(function() {
      return map = new Map();
    });
    it("throws if key isn't found", function() {
      return all_keys.forEach(function(k) {
        return expect(function() {
          return map.get(k);
        }).to["throw"](Error);
      });
    });
    describe("primitives", function() {
      it("allows primitive keys", function() {
        return primitive_keys.forEach(function(k) {
          map.set(k, k);
          return expect(map.get(k)).to.equal(k);
        });
      });
      return it("retrieves value for 'same' primitives", function() {
        return [[0, 0], [1, 1], [1.5, 1.5], ["", ""], ["1", "1"], [true, true], [false, false]].forEach(function(_arg) {
          var k1, k2;
          k1 = _arg[0], k2 = _arg[1];
          val = {};
          map.set(k1, val);
          return expect(map.get(k2)).to.equal(val);
        });
      });
    });
    describe("non-primitives", function() {
      it("allows non-primitive keys", function() {
        return non_primitive_keys.forEach(function(k) {
          map.set(k, k);
          return expect(map.get(k)).to.equal(k);
        });
      });
      it("treats all objects differently", function() {
        map.set({});
        return expect(function() {
          return map.get({});
        }).to["throw"](Error);
      });
      return it("compares objects by identity", function() {
        map.set({
          $hash: 1
        });
        return expect(function() {
          return map.get({
            $hash: 1
          });
        }).to["throw"](Error);
      });
    });
    describe("existance", function() {
      it("checks key exists", function() {
        return all_keys.forEach(function(k) {
          expect(map.has(k)).to.be["false"];
          map.set(k);
          return expect(map.has(k)).to.be["true"];
        });
      });
      return it("overrides value if a key is added more than once", function() {
        return all_keys.forEach(function(k) {
          map.set(k, 1);
          map.set(k, 2);
          return expect(map.get(k)).to.equal(2);
        });
      });
    });
    describe("all", function() {
      it("works for all types of values", function() {
        return all_pairs.forEach(function(_arg) {
          var k, res, v;
          k = _arg[0], v = _arg[1];
          expect(map.has(k)).to.be["false"];
          map.set(k, v);
          expect(map.has(k)).to.be["true"];
          expect(map.get(k)).to.equal(v);
          res = map.del(k);
          expect(map.has(k)).to.be["false"];
          expect(res[0]).to.equal(k);
          return expect(res[1]).to.equal(v);
        });
      });
      return it("retrieves all keys", function() {
        all_keys.forEach(function(k) {
          return map.set(k);
        });
        expect(map.keys().length).to.equal(all_keys.length);
        return expect(map.all().length).to.equal(all_keys.length);
      });
    });
    describe("Array methods", function() {
      beforeEach(function() {
        return all_keys.forEach(function(k) {
          return map.set(k);
        });
      });
      it("supports forEach()", function() {
        return map.forEach(function(_arg) {
          var k, v;
          k = _arg[0], v = _arg[1];
          return expect(all_keys).to.include.members([k]);
        });
      });
      it("supports map()", function() {
        return map.map(function(_arg) {
          var k, v;
          k = _arg[0], v = _arg[1];
          return expect(all_keys).to.include.members([k]);
        });
      });
      it("supports reduce()", function() {
        return map.reduce(function(_, _arg) {
          var k, v;
          k = _arg[0], v = _arg[1];
          return expect(all_keys).to.include.members([k]);
        });
      });
      return it("supports other methods, but I'm lazy...", function() {});
    });
    return describe("extensibility", function() {
      return it("allows custom strategy", function() {
        var Person, java_like_strategy, lang_prefs, p1, p2, preferences;
        java_like_strategy = {
          hash: function(k) {
            return k.hashCode();
          },
          equal: function(k1, k2) {
            return k1.equals(k2);
          }
        };
        preferences = new Map(java_like_strategy);
        Person = (function() {
          function Person(name, age) {
            this.name = name;
            this.age = age;
          }

          Person.prototype.hashCode = function() {
            return this.name + this.age;
          };

          Person.prototype.equals = function(other) {
            return this.name === other.name && this.age === other.age;
          };

          return Person;

        })();
        lang_prefs = {
          languages: ["coffee", "js"]
        };
        p1 = new Person("guy", 30);
        p2 = new Person("guy", 30);
        preferences.set(p1, lang_prefs);
        return expect(preferences.get(p2)).to.equal(lang_prefs);
      });
    });
  });

}).call(this);
