New methods:

* Map.prototype.computeDefault(key, function)

Sets the value assigned to `key` if it's not set yet from the result of the supplied function. Returns either the already assigned value or the new one. **Warning: This can modify the map.**

* Map.prototype.deleteWith(predicate, thisArg)

Deletes all keys and values for which the call of predicate(value, key, map) returns a truth-y value. Returns a `Map` with the removed elements. **Warning: This can modify the map.**

* Map.prototype.every(predicate, thisArg)

Returns `true` if and only if the call to predicate(value, key, map) returns a truth-y value for all values inside the map. Returns `false` otherwise.

* Map.prototype.find(predicate, thisArg)

Returns the first value for which a call to predicate(value, key, map) returns a truth-y value - even if that value is `undefined`. Returns `undefined` otherwise.

* Map.prototype.findKey(predicate, thisArg)

Returns the first key for which a call to predicate(value, key, map) returns a truth-y value. Returns `undefined` otherwise.

* Map.prototype.filter(predicate, thisArg)

Returns a new map with only items for which a call to predicate(value, key, map) returns a truth-y value. Doesn't modify the original map.

* Map.prototype.getDefault(key, value)

Return the value associated with the key if there is one (even if it's `undefined`), else the value provided in the second argument.

* Map.prototype.mapKeys(callback, thisArg)

Returns a new map with new keys as returned by callback(value, key, map). In case of key conflicts the last one "wins".

* Map.prototype.mapValues(callback, thisArg)

Returns a new map with values as returned by callback(value, key, map).

* Map.prototype.reduce(reducer, initialValue)

Returns a result after calling accumulator = reducer(accumulator, value, key, map) consecutively, with accumulator being either the provided `initivalValue` or the first value in the map. This works analogous to `Array.prototype.reduce`, and consequently requires the map to be non-empty if called without an explicit initial value.

* Map.prototype.setDefault(key, value)

Sets the value assigned with the key to the new value if it isn't set already. Returns either the already existing value, or the new one, whichever ends up in the map - same as a subsequent call to `map.get(key)` would.

* Map.prototype.some(predicate, thisArg)

Returns `true` if a call to predicate(value, key, map) returns a truth-y result for any of the stored key-value pairs.

* Map.prototype.update(key, value)

Sets the value assigned to the key to the new value if it is already set, else does nothing. Returns the map itself for chaining.

* Map.prototype.updateWith(key, callback)

Sets the value assigned to the key to the return value of the callback function if it is already set, else does nothing. The function is only called when necessary. Returns the map itself for chaining.

The following methods work with the iterators returned by Map.prototype.entries(), Map.prototype.keys() and Map.prototype.values().

* MapIterator.prototype.every(predicate, thisArg)

Evaluates the iterator and returns `true` if and only if all the values returned by predicate(value) are truth-y. Returns `false` otherwise.

* MapIterator.prototype.filter(predicate, thisArg)

Returns a new iterator which skips all the items of the original iterator for which a call to predicate(value) doesn't return a truth-y value.

* MapIterator.prototype.find(predicate, thisArg)

Evaluates the iterator until it finds the first value for which a call to predicate(value) returns a truth-y value, then returns that value. If no value was found, returns `undefined`. If the iterator isn't finished at this point, it can still be used to grab the remaining values, allowing for subsequent calls to `find()` on it to eventually find all the occurences for which the predicate matches.

* MapIterator.prototype.forEach(callback, thisArg)

Evaluates the iterator and calls callback(value) for each value in order.

* MapIterator.prototype.limit(number)

Returns a new iterator which returns at most the first `number` items from the original iterator. The limit can be any integer larger than or equal to 0.

* MapIterator.prototype.map(callback, thisArg)

Returns a new iterator which, for every call to `next()`, returns the original iterator's value after replacing it with the result of calling callback(value).

* MapIterator.prototype.reduce(reducer, initialValue)

Returns a result after calling accumulator = reducer(accumulator, value) consecutively, with accumulator being either the provided `initivalValue` or the first value returned by the original iterator. This works analogous to `Array.prototype.reduce`, and consequently requires the iterator to return at least one item if called without an explicit initial value.

* MapIterator.prototype.skip(number)

Returns a new iterator which skips the first `number` elements returned by the original iterator. The number can be any integer larger than or equal to 0.

* MapIterator.prototype.some(predicate, thisArg)

Evaluates the iterator and returns `true` if a call to predicate(value) for any of the values returns a truth-y value. If the iterator isn't finished at this point, it can still be used to grab the remaining values.

* MapIterator.prototype.toArray()

Evaluates the iterator and returns a plain array containing its values. This corresponds to a call of `Array.from(iterator)`.