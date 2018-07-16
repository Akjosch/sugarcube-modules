(function (root, factory) {
    if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['lodash'], factory);
	} else if(typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('lodash'));
	} else if(typeof setup === 'object') {
		// SugarCube globals
		setup.Items = factory(root._);
    } else {
        // Browser globals
        root.Items = factory(root._);
    }
}(typeof self !== 'undefined' ? self : this, function(_) {
	var _list = {};
	var _none = undefined;
	
	// Item class
	var Item = function(id, name, options) {
		options = options || {};
		this.id = id;
		this.name = name;
		
		// Copy options
		this.long = options.long || undefined;
		this.short = options.short || undefined;
		this.icon = options.icon || "item_unknown";
		this.invisible = options.invisible;
		this.value = options.value;
		this.tags = options.tags || [];
		this.hasTag = (t => this.tags.includes(t));
		this.hasAnyTag = (ts => this.tags.includesAny(ts));
		this.hasAct = (a => !!(this.acts[a]));
		this.validFor = options.validFor || (ch => true);
		// Copy acts
		this.acts = {};
		Object.keys(options).filter(k => k.startsWith('act') && k.length > 3)
			.forEach(k => this.acts[k.slice(3)] = options[k]);
		// Copy anything starting with "_" (internal data)
		Object.keys(options).filter(k => k.startsWith('_') && k.length > 1)
			.forEach(k => this[k] = options[k]);
		
		// If the attribute's value is a simple value, return that
		// If the value is a function, call it with the character and attribute name,
		// If the value is an array, pick a value at random
		this.describe = ((ch, attr) => {
			var result = this[attr];
			if(typeof result === 'function') {
				console.log(this);
				return result.call(this, ch, attr);
			} else if(result instanceof Array) {
				return result.random();
			} else {
				return result;
			}
		});
		// Similar to describe, but for acts, so always returns some String.
		this.act = ((ch, act) => {
			if(!this.hasAct(act)) {
				return '';
			}
			var result = this.acts[act];
			if(typeof result === 'function') {
				return String(result.call(this, ch, act)) || '';
			} else if(result instanceof Array) {
				return String(result.random()) || '';
			} else {
				return String(result) || '';
			}
		});

		// Description functions using the above
		this.longDesc = (ch => this.describe(ch, 'long') || '');
		// Defaults to the name with a period after it, for character summary and the like
		this.shortDesc = (ch => (this.describe(ch, 'short') || this.name));
	};
	
	var Items = {
		define: function(id, name, options) {
			if(!id || !name) {
				throw 'The item needs a valid ID and plain-text name';
			}
			return _list[id] = new Item(id, name, options);
		},
		byId: (id => _list[id] || _none),
		allValidFor: (ch => Object.values(_list).filter(cl => cl.validFor(ch))),
		get all() { return Object.values(_list); }
	};
	
	return Items;
}));
