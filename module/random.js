/*
 * Random distributions
 *
 * Usage:
 *   Once loaded (via requireJS or simply inclusion via a script tag in the header),
 *   specific distribution instances can be created with the "new" keyword. 
 *   The following examples assume the whole module is named "Random":
 * 
 *   // A uniformly random distribution between 10 and 130
 *   var uniform = new Random.UniformDistribution(10, 130);
 *
 *   // A normal distribution with a mean (average value) of 50 and a standard deviation of 25
 *   var normal = new Random.NormalDistributin(50, 25);
 *
 *   // A normal distribution as above, skewed to the right
 *   var skewed = new Random.SkewNormalDistribution(50, 25, 1.2);
 *
 *   // A gamma distribution with a shape parameter of 43.6 and a scale one of 1.667
 *   var gamma = new Random.GammaDistribution(43.6, 1.667);
 * 
 *   // A triangular distribution between 0 and 100, with the mode (most common value) of 24
 *   var triangle = new Random.TriangularDistribution(0, 24, 100);
 *
 *   // A Kumaraswamy distribution this a = 1.2, b = 5
 *   var kumaraswamy = new Random.KumaraswamyDistribution(1.2, 5);
 *
 *   All the distributions support the following methods:
 *
 *   sample()
 *   - Take one sample value from the distribution, at random, using JavaScript's built-in Math.random() method.
 *
 *	 The usage of Math.random() means that the upper bounds of the uniform and triangular distributions
 *	 are exclusive - they can never be returned - since the underlying random number generator generates
 *	 numbers in the range of 0 (inclusive) to 1 (exclusive).
 *
 *   sample(randomFunction)
 *   - Take one sample value from the distribution using randomFunction() to provide the underlying value.
 *
 *	 The random function is expected to return a value between 0 and 1. The returned random values are
 *	 only (at best) as well distributed as the random function allows.
 *
 *	 Example:
 *	 var normal = new Random.NormalDistribution(10, 2);
 *	 var result = normal.sample(function() { return 0.42; });
 *	 console.log(result);
 *
 *	 Warning: some of the random generation functions use rejection sampling. If provided with insufficiently
 *	 random function, they can take a long time to find a valid value. In the worst case, they might never
 *	 terminate the processing.
 */
 
(function (root, factory) {
	if(typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if(typeof exports === 'object') {
		// Node, CommonJS-like
		module.exports = factory();
	} else if(typeof setup === 'object') {
		// SugarCube globals
		setup.Random = factory();
	} else {
		// Browser globals
		root.Random = factory();
	}
}(typeof self !== 'undefined' ? self : this, function() {
	var UniformDistribution = (function() {
		var dist = function(lim1, lim2) {
			if(lim1 < lim2) {
				this.lower = lim1;
				this.upper = lim2;
			} else {
				this.lower = lim2;
				this.upper = lim1;
			}
		}
		
		dist.prototype.sample = function(rnd) {
			rnd = rnd || Math.random;
			var u = rnd();
			return u * this.upper + (1 - u) * this.lower;
		};
		
		return dist;
	})();

	var NormalDistribution = (function() {
		var dist = function(mean, sd) {
			if(!Number.isFinite(sd) || sd <= 0) {
				throw "Standard deviation value needs to be a number larger than 0";
			}
			if(!Number.isFinite(mean)) {
				throw "Mean needs to be finite number";
			}
			this.mean = mean;
			this.sd = sd;
		};
		
		dist.prototype.sample = function(rnd) {
			rnd = rnd || Math.random;
			var u = 1 - rnd();
			var v = 1 - rnd();
			return this.mean + Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * this.sd;
		};
		
		return dist;
	})();

	var SkewNormalDistribution = (function() {
		var dist = function(mean, sd, skew) {
			if(!Number.isFinite(sd) || sd <= 0) {
				throw "Standard deviation value needs to be a number larger than 0";
			}
			if(!Number.isFinite(mean)) {
				throw "Mean needs to be finite number";
			}
			if(!Number.isFinite(skew)) {
				throw "Skew needs to be finite number";
			}
			this.mean = mean;
			this.sd = sd;
			this.skew = skew;
		};
		
		dist.prototype.sample = function(rnd) {
			rnd = rnd || Math.random;
			var r = Math.sqrt(-2.0 * Math.log(1 - rnd()));
			var sigma = 2.0 * Math.PI * (1 - rnd());
			if(this.skew == 0) {
				return this.mean + r * Math.cos(sigma) * this.sd;
			}
			var delta = this.skew / Math.sqrt(1 + this.skew * this.skew);
			var positive = (r * Math.cos(sigma) >= 0);
			var result = delta * r * Math.cos(sigma) + Math.sqrt(1 - delta * delta) * r * Math.sin(sigma);
			return this.mean + (positive ? 1 : -1) * result * this.sd;
		};
		
		return dist;
	})();

	var GammaDistribution = (function() {
		var gaussian = new NormalDistribution(0, 1);
		
		var dist = function(shape, scale) {
			if(!Number.isFinite(shape) || shape <= 0) {
				throw "Shape value needs to be a number larger than 0";
			}
			if(!Number.isFinite(scale) || scale <= 0) {
				throw "Scale value needs to be a number larger than 0";
			}
			this.shape = shape;
			this.scale = scale;
		};
		
		dist.prototype.sample = function(rnd) {
			rnd = rnd || Math.random;
			if(this.shape < 1) {
				while(true) {
					var u = rnd();
					var bGS = 1 + this.shape / Math.E;
					var p = bGS * u;
					
					if(p <= 1) {
						var x = Math.pow(p, 1 / this.shape);
						var u2 = rnd();
						if(u2 > Math.exp(-x)) {
							// Reject
							continue;
						} else {
							return this.scale * x;
						}
					} else {
						var x = -1 * Math.log((bGS - p) / this.shape);
						var u2 = rnd();
						if(u2 > Math.pow(x, this.shape - 1)) {
							// Reject
							continue;
						} else {
							return this.scale * x;
						}
					}
				}
			}
			// Now this.shape is >= 1
			var d = this.shape - 0.333333333333333333;
			var c = 1 / (3 * Math.sqrt(d));
			while(true) {
				var x = gaussian.sample(rnd);
				var v = (1 + c * x) * (1 + c * x) * (1 + c * x);
				if(v <= 0) {
					continue;
				}
				
				var x2 = x * x;
				var u = rnd();
				if(u < 1 - 0.0331 * x2 * x2) {
					return this.scale * d * v;
				}
				if(Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
					return this.scale * d * v;
				}
			}
		};
		
		return dist;
	})();

	var TriangularDistribution = (function() {
		var dist = function(lower, mode, upper) {
			if(lower >= upper) {
				throw "Lower bound needs to be below upper bound";
			}
			if(mode < lower) {
				throw "Mode needs to be at least equal to the lower bound";
			}
			if(mode > upper) {
				throw "Mode needs to be not larger than the upper bound";
			}
			this.lower = lower;
			this.mode = mode;
			this.upper = upper;
		};
		
		dist.prototype.sample = function(rnd) {
			rnd = rnd || Math.random;
			var p = rnd();
			if(p <= 0) {
				return this.lower;
			}
			if(p >= 1) {
				return this.upper;
			}
			var range = this.upper - this.lower;
			if(p < (this.mode - this.lower) / range) {
				return this.lower + Math.sqrt(p * (this.mode - this.lower) * range);
			}
			return this.upper - Math.sqrt((1 - p) * (this.upper - this.mode) * range);
		};
		
		return dist;
	})();
	
	var KumaraswamyDistribution = (function() {
		var dist = function(alpha, beta) {
			if(alpha <= 0 || beta <= 0) {
				throw "Both parameters need to be larger than zero";
			}
			this.alpha = alpha;
			this.beta = beta;
		};
		dist.prototype.sample = function(rnd) {
			rnd = rnd || Math.random;
			var p = rnd();
			return Math.pow(1 - Math.pow(1 - p, 1 / this.alpha), 1 / this.beta);
		};
	   
		return dist;
	})();
	
	return {
		UniformDistribution: UniformDistribution,
		NormalDistribution: NormalDistribution,
		SkewNormalDistribution: SkewNormalDistribution,
		GammaDistribution: GammaDistribution,
		TriangularDistribution: TriangularDistribution,
		KumaraswamyDistribution: KumaraswamyDistribution,
	};
}));