(function() {
  var Map, Set, global, next, qhash;

  next = 1;

  qhash = function(k) {
    if ((k == null) || ((typeof k !== "object") && (typeof k !== "function"))) {
      throw new TypeError();
    }
    return k.$hash != null ? k.$hash : k.$hash = next++;
  };

  Map = (function() {
    function Map(hash) {
      this.hash = hash != null ? hash : qhash;
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
      var v, _i, _k, _len, _ref, _ref1;
      _ref = this._buckets[this.hash(k)] || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], _k = _ref1[0], v = _ref1[1];
        if (_k === k) {
          return v;
        }
      }
      throw new Error();
    };

    Map.prototype.set = function(k, v) {
      var bucket, entry, _base, _i, _len, _name;
      bucket = (_base = this._buckets)[_name = this.hash(k)] != null ? _base[_name] : _base[_name] = [];
      for (_i = 0, _len = bucket.length; _i < _len; _i++) {
        entry = bucket[_i];
        if (entry[0] === k) {
          return entry[1] = v;
        }
      }
      return bucket.push([k, v]);
    };

    Map.prototype.del = function(k) {
      var bucket, index, v, _i, _k, _len, _ref, _ref1;
      _ref = (bucket = this._buckets[this.hash(k)] || []);
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        _ref1 = _ref[index], _k = _ref1[0], v = _ref1[1];
        if (_k === k) {
          return bucket.splice(index, 1)[0];
        }
      }
    };

    Map.prototype.keys = function() {
      var bucket, h, k, v, _keys, _ref;
      _keys = [];
      _ref = this._buckets;
      for (h in _ref) {
        bucket = _ref[h];
        _keys = _keys.concat((function() {
          var _i, _len, _ref1, _results;
          _results = [];
          for (_i = 0, _len = bucket.length; _i < _len; _i++) {
            _ref1 = bucket[_i], k = _ref1[0], v = _ref1[1];
            _results.push(k);
          }
          return _results;
        })());
      }
      return _keys;
    };

    return Map;

  })();

  Set = (function() {
    function Set(hash) {
      if (hash == null) {
        hash = qhash;
      }
      this._qdh = new Map(hash);
    }

    Set.prototype.has = function(obj) {
      return this._qdh.has(obj);
    };

    Set.prototype.add = function(obj) {
      return this._qdh.set(obj);
    };

    Set.prototype.del = function(obj) {
      return this._qdh.del(obj);
    };

    Set.prototype.all = function() {
      return this._qdh.keys();
    };

    return Set;

  })();

  ["forEach", "map", "reduce"].forEach(function(fn) {
    return Set.prototype[fn] = function() {
      return Array.prototype[fn].apply(this.all(), arguments);
    };
  });

  global = typeof module !== 'undefined' && module.exports ? module.exports : window;

  global.Map = Map;

  global.Set = Set;

}).call(this);
