(function() {
  var Map, Set, global, i, quickdirty, template, types, _i, _ref;

  types = ["Array", "Function", "String", "Number", "Boolean", "RegExp", "Date"];

  template = (function is$(o) { return Object.prototype.toString.call(o) === '[object $]' }).toString();

  for (i = _i = 0, _ref = types.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    eval(template.replace(/\$/g, types[i]));
  }

  quickdirty = function() {
    var next;
    next = 1;
    return {
      hash: function(k) {
        if (k == null) {
          return Object.prototype.toString.call(k);
        }
        if (isString(k)) {
          return k;
        }
        if (isNumber(k) || isBoolean(k) || isRegExp(k) || isDate(k)) {
          return k.toString();
        }
        return k.$hash != null ? k.$hash : k.$hash = next++;
      },
      equal: function(k1, k2) {
        return k1 === k2;
      }
    };
  };

  Map = (function() {
    function Map(strategy) {
      this.strategy = strategy != null ? strategy : quickdirty();
      this._buckets = {};
    }

    Map.prototype.has = function(k) {
      try {
        this.get(k);
        return true;
      } catch (_error) {
        return false;
      }
    };

    Map.prototype.get = function(k) {
      var v, _j, _k, _len, _ref1, _ref2;
      _ref1 = this._buckets[this.strategy.hash(k)] || [];
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        _ref2 = _ref1[_j], _k = _ref2[0], v = _ref2[1];
        if (this.strategy.equal(_k, k)) {
          return v;
        }
      }
      throw new Error();
    };

    Map.prototype.set = function(k, v) {
      var bucket, entry, _base, _j, _len, _name;
      bucket = (_base = this._buckets)[_name = this.strategy.hash(k)] != null ? _base[_name] : _base[_name] = [];
      for (_j = 0, _len = bucket.length; _j < _len; _j++) {
        entry = bucket[_j];
        if (this.strategy.equal(entry[0], k)) {
          return entry[1] = v;
        }
      }
      return bucket.push([k, v]);
    };

    Map.prototype.del = function(k) {
      var bucket, index, v, _j, _k, _len, _ref1, _ref2;
      _ref1 = (bucket = this._buckets[this.strategy.hash(k)] || []);
      for (index = _j = 0, _len = _ref1.length; _j < _len; index = ++_j) {
        _ref2 = _ref1[index], _k = _ref2[0], v = _ref2[1];
        if (this.strategy.equal(_k, k)) {
          return bucket.splice(index, 1)[0];
        }
      }
    };

    Map.prototype.keys = function() {
      var bucket, h, k, keys, v, _ref1;
      keys = [];
      _ref1 = this._buckets;
      for (h in _ref1) {
        bucket = _ref1[h];
        keys = keys.concat((function() {
          var _j, _len, _ref2, _results;
          _results = [];
          for (_j = 0, _len = bucket.length; _j < _len; _j++) {
            _ref2 = bucket[_j], k = _ref2[0], v = _ref2[1];
            _results.push(k);
          }
          return _results;
        })());
      }
      return keys;
    };

    Map.prototype.all = function() {
      var bucket, h, pairs, _ref1;
      pairs = [];
      _ref1 = this._buckets;
      for (h in _ref1) {
        bucket = _ref1[h];
        pairs = pairs.concat(bucket);
      }
      return pairs;
    };

    return Map;

  })();

  Set = (function() {
    function Set(strategy) {
      if (strategy == null) {
        strategy = quickdirty();
      }
      this.map = new Map(strategy);
    }

    Set.prototype.has = function(obj) {
      return this.map.has(obj);
    };

    Set.prototype.add = function(obj) {
      return this.map.set(obj);
    };

    Set.prototype.del = function(obj) {
      return this.map.del(obj);
    };

    Set.prototype.all = function() {
      return this.map.keys();
    };

    return Set;

  })();

  ["every", "filter", "find", "forEach", "map", "reduce", "reduceRight", "some"].forEach(function(fn) {
    if (isFunction(Array.prototype[fn])) {
      return Map.prototype[fn] = Set.prototype[fn] = function() {
        return Array.prototype[fn].apply(this.all(), arguments);
      };
    }
  });

  global = typeof module !== 'undefined' && module.exports ? module.exports : window;

  global.Map = Map;

  global.Set = Set;

}).call(this);
