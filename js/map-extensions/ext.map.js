function iterateEntries(iterator, fn) {
	const next = iterator.next;
	let data;
	while(!(data = next.call(iterator)).done) {
		fn(data.value[0], data.value[1]);
	}
}

function constructor(instance, cls) {
	if(!instance || !instance.constructor) {
		return cls;
	}
	return instance.constructor[Symbol.species] || instance.constructor;
}

if(!Map.prototype.computeDefault) {
	Object.defineProperty(Map.prototype, 'computeDefault', {
		configurable: true,
		writable: true,
		value: function computeDefault(key, callbackfn) {
			if(!this.has(key)) {
				this.set(key, callbackfn());
			}
			return this.get(key);
		}
	});
}

if(!Map.prototype.deleteWith) {
	Object.defineProperty(Map.prototype, 'deleteWith', {
		configurable: true,
		writable: true,
		value: function deleteWith(predicate /* , thisArg */) {
			const iterator = this.entries(),
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined),
				removalMap = new (constructor(this, Map))();
			let stop;
			while(!(stop = iterator.next()).done) {
				if(boundFunction(stop.value[1], stop.value[0], this)) {
					removalMap.set(stop.value[0], stop.value[1]);
					this.delete(stop.value[0]);
				}
			}
			return removalMap;
		}
	});
}

if(!Map.prototype.every) {
	Object.defineProperty(Map.prototype, 'every', {
		configurable: true,
		writable: true,
		value: function every(predicate /* , thisArg */) {
			const iterator = this.entries(),
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined);
			let stop;
			while(!(stop = iterator.next()).done) {
				if(!boundFunction(stop.value[1], stop.value[0], this)) {
					return false;
				}
			}
			return true;
		}
	});
}

if(!Map.prototype.find) {
	Object.defineProperty(Map.prototype, 'find', {
		configurable: true,
		writable: true,
		value: function find(predicate /* , thisArg */) {
			const iterator = this.entries(),
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined);
			let stop;
			while(!(stop = iterator.next()).done) {
				if(boundFunction(stop.value[1], stop.value[0], this)) {
					return stop.value[1];
				}
			}
			return undefined;
		}
	});
}

if(!Map.prototype.findKey) {
	Object.defineProperty(Map.prototype, 'findKey', {
		configurable: true,
		writable: true,
		value: function findKey(predicate /* , thisArg */) {
			const iterator = this.entries(),
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined);
			let stop;
			while(!(stop = iterator.next()).done) {
				if(boundFunction(stop.value[1], stop.value[0], this)) {
					return stop.value[0];
				}
			}
			return undefined;
		}
	});
}

if(!Map.prototype.filter) {
	Object.defineProperty(Map.prototype, 'filter', {
		configurable: true,
		writable: true,
		value: function filter(predicate /* , thisArg */) {
			const map = this,
				iterator = this.entries(),
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined),
				newMap = new (constructor(this, Map))();
			iterateEntries(iterator, function (key, value) {
				if(boundFunction(value, key, map)) {
					newMap.set(key, value);
				}
			});
			return newMap;
		  }
	});
}

if(!Map.prototype.getDefault) {
	Object.defineProperty(Map.prototype, 'getDefault', {
		configurable: true,
		writable: true,
		value: function getDefault(key, value) {
			return this.has(key) ? this.get(key) : value;
		}
	});
}

if(!Map.prototype.mapKeys) {
	Object.defineProperty(Map.prototype, 'mapKeys', {
		configurable: true,
		writable: true,
		value: function mapKeys(callbackfn /* , thisArg */) {
			const map = this,
				iterator = this.entries(),
				boundFunction = callbackfn.bind(arguments.length > 1 ? arguments[1] : undefined),
				newMap = new (constructor(this, Map))();
			iterateEntries(iterator, function (key, value) {
				newMap.set(boundFunction(value, key, map), value);
			});
			return newMap;
		  }
	});
}

if(!Map.prototype.mapValues) {
	Object.defineProperty(Map.prototype, 'mapValues', {
		configurable: true,
		writable: true,
		value: function mapValues(callbackfn /* , thisArg */) {
			const map = this,
				iterator = this.entries(),
				boundFunction = callbackfn.bind(arguments.length > 1 ? arguments[1] : undefined),
				newMap = new (constructor(this, Map))();
			iterateEntries(iterator, function (key, value) {
				newMap.set(key, boundFunction(value, key, map));
			});
			return newMap;
		  }
	});
}

if(!Map.prototype.reduce) {
	Object.defineProperty(Map.prototype, 'reduce', {
		configurable: true,
		writable: true,
		value: function reduce(callbackfn /* , initialValue */) {
			const map = this,
				iterator = this.entries();
			let noInitial = arguments.length < 2,
				accumulator = noInitial ? undefined : arguments[1];
			iterateEntries(iterator, function (key, value) {
				if(noInitial) {
					noInitial = false;
					accumulator = value;
				} else {
					accumulator = callbackfn(accumulator, value, key, map);
				}
			});
			if(noInitial) {
				throw TypeError('Reduce of empty map with no initial value');
			}
			return accumulator;
		  }
	});
}

if(!Map.prototype.setDefault) {
	Object.defineProperty(Map.prototype, 'setDefault', {
		configurable: true,
		writable: true,
		value: function setDefault(key, value) {
			if(!this.has(key)) {
				this.set(key, value);
			}
			return this.get(key);
		}
	});
}

if(!Map.prototype.some) {
	Object.defineProperty(Map.prototype, 'some', {
		configurable: true,
		writable: true,
		value: function some(predicate /* , thisArg */) {
			const iterator = this.entries(),
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined);
			let stop;
			while(!(stop = iterator.next()).done) {
				if(boundFunction(stop.value[1], stop.value[0], this)) {
					return true;
				}
			}
			return false;
		}
	});
}

if(!Map.prototype.update) {
	Object.defineProperty(Map.prototype, 'update', {
		configurable: true,
		writable: true,
		value: function update(key, value) {
			if(this.has(key)) {
				this.set(key, value);
			}
			return this;
		}
	});
}

if(!Map.prototype.updateWith) {
	Object.defineProperty(Map.prototype, 'updateWith', {
		configurable: true,
		writable: true,
		value: function updateWith(key, callbackfn) {
			if(this.has(key)) {
				this.set(key, callbackfn(this.get(key), key, this));
			}
			return this;
		}
	});
}

const MapIteratorProto = Object.getPrototypeOf(new Map().entries());

if(!MapIteratorProto.every) {
	Object.defineProperty(MapIteratorProto, 'every', {
		configurable: true,
		writable: true,
		value: function every(predicate /*, thisArg*/) {
			const iter = this,
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined);
			let data;
			while(!(data = iter.next()).done) {
				if(!boundFunction(data.value)) {
					return false;
				}
			}
			return true;
		}
	});
}

if(!MapIteratorProto.filter) {
	Object.defineProperty(MapIteratorProto, 'filter', {
		configurable: true,
		writable: true,
		value: function filter(callbackfn /*, thisArg*/) {
			const iter = this,
				boundFunction = callbackfn.bind(arguments.length > 1 ? arguments[1] : undefined);
			const result = {
				next() {
					let data;
					while(!(data = iter.next()).done) {
						if(boundFunction(data.value)) {
							return data;
						}
					}
					return data;
				}
			};
			Object.setPrototypeOf(result, MapIteratorProto);
			return result;
		}
	});
}

if(!MapIteratorProto.find) {
	Object.defineProperty(MapIteratorProto, 'find', {
		configurable: true,
		writable: true,
		value: function find(predicate /*, thisArg*/) {
			const iter = this,
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined);
			let data;
			while(!(data = iter.next()).done) {
				if(boundFunction(data.value)) {
					return data.value;
				}
			}
			return undefined;
		}
	});
}

if(!MapIteratorProto.forEach) {
	Object.defineProperty(MapIteratorProto, 'forEach', {
		configurable: true,
		writable: true,
		value: function forEach(callbackfn /*, thisArg*/) {
			const boundFunction = callbackfn.bind(arguments.length > 1 ? arguments[1] : undefined);
			let data;
			while(!(data = this.next()).done) {
				boundFunction(data.value);
			}
			return undefined;
		}
	});
}

if(!MapIteratorProto.limit) {
	Object.defineProperty(MapIteratorProto, 'limit', {
		configurable: true,
		writable: true,
		value: function limit(number) {
			const iter = this,
				lim = Math.floor(Number(number));
			if(lim < 0) {
				throw RangeError("limit less than zero");
			}
			let count = 0;
			const result = {
				next() {
					if(count < lim) {
						++ count;
						return iter.next();
					} else {
						return { done: true };
					}
				}
			};
			Object.setPrototypeOf(result, MapIteratorProto);
			return result;
		}
	});
}

if(!MapIteratorProto.map) {
	Object.defineProperty(MapIteratorProto, 'map', {
		configurable: true,
		writable: true,
		value: function map(callbackfn /*, thisArg*/) {
			const iter = this,
				boundFunction = callbackfn.bind(arguments.length > 1 ? arguments[1] : undefined);
			const result = {
				next() {
					let data = iter.next();
					if(!data.done) {
						data.value = boundFunction(data.value);
					}
					return data;
				}
			};
			Object.setPrototypeOf(result, MapIteratorProto);
			return result;
		}
	});
}

if(!MapIteratorProto.reduce) {
	Object.defineProperty(MapIteratorProto, 'reduce', {
		configurable: true,
		writable: true,
		value: function reduce(callbackfn /* , initialValue */) {
			const iter = this;
			let noInitial = arguments.length < 2,
				accumulator = noInitial ? undefined : arguments[1];
				let data;
			while(!(data = this.next()).done) {
				if(noInitial) {
					noInitial = false;
					accumulator = data.value;
				} else {
					accumulator = callbackfn(accumulator, data.value);
				}
			}
			if(noInitial) {
				throw TypeError('Reduce of empty or finished iterator with no initial value');
			}
			return accumulator;
		}
	});
}

if(!MapIteratorProto.skip) {
	Object.defineProperty(MapIteratorProto, 'skip', {
		configurable: true,
		writable: true,
		value: function skip(number) {
			const iter = this,
				lim = Math.floor(Number(number));
			if(lim < 0) {
				throw RangeError("skip less than zero");
			}
			let count = 0;
			const result = {
				next() {
					while(count < lim) {
						++ count;
						iter.next();
					}
					return iter.next();
				}
			};
			Object.setPrototypeOf(result, MapIteratorProto);
			return result;
		}
	});
}

if(!MapIteratorProto.some) {
	Object.defineProperty(MapIteratorProto, 'some', {
		configurable: true,
		writable: true,
		value: function some(predicate /*, thisArg*/) {
			const iter = this,
				boundFunction = predicate.bind(arguments.length > 1 ? arguments[1] : undefined);
			let data;
			while(!(data = iter.next()).done) {
				if(boundFunction(data.value)) {
					return true;
				}
			}
			return false;
		}
	});
}

if(!MapIteratorProto.toArray) {
	Object.defineProperty(MapIteratorProto, 'toArray', {
		configurable: true,
		writable: true,
		value: function toArray() {
			return Array.from(this);
		}
	});
}
