/**
 * Created by USER on 10/1/2015.
 */
var Immutable = require("immutable");

var Flock = function(n) {
    this.seagulls = n;
};

Flock.prototype.conjoin = function(other) {
    this.seagulls += other.seagulls;
    return this;
};

Flock.prototype.breed = function(other) {
    this.seagulls = this.seagulls * other.seagulls;
    return this;
};

var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);

var result = flock_a.conjoin(flock_c).breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls;
//console.log(result);

var conjoin = function(flock_x, flock_y) {
	return flock_x + flock_y;
};

var breed = function(flock_x, flock_y) {
	return flock_x * flock_y;
};

var flock_a = 4;
var flock_b = 2;
var flock_c = 0;

var result = conjoin(breed(flock_b, conjoin(flock_a, flock_c)), breed(flock_a, flock_b));
//console.log(result);

var add = function(x, y) {
	return x + y;
};

var multipy = function(x, y) {
	return x * y;
};

var a = 4;
var b = 2;
var c = 0;

//console.log(add(multipy(b, add(a,c)), multipy(a, b)));

//console.log(add);

var xs = [1, 2, 3, 4, 5];

//console.log(xs.slice(0, 3));

//console.log(xs.splice(0, 3));

//console.log(xs.splice(0, 3));

var memoize = function(f) {
	var cache = {};

	return function() {
		var arg_str = JSON.stringify(arguments);
		cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
		return cache[arg_str];
	};
};

var squareNumber = memoize(function(x){ return x * x;});

//console.log(squareNumber(2));

//console.log(squareNumber(2));


var decrementHP = function(player) {
	return player.set("hp", player.get("hp") - 1);
};

var isSameTeam = function(player1, player2) {
	return player1.get("team") === player2.get("team");
};

var punch = function(player, target) {
	if (isSameTeam(player, target)) {
		return target;
	} else {
		return decrementHP(target);
	}
};

var jobe = Immutable.Map({name:"Jobe", hp:20, team:"red"});
var michael = Immutable.Map({name:"Michael", hp:20, team:"green"});

//console.log(punch(jobe, michael));

var n = 123;
//console.log(n.toString(16));
//console.log('hello world'.big());

var add = function(x) {
	return function(y) {
		return x + y;
	};
};

var increment = add(1);
var addTen = add(10);

//console.log(increment(2));
//console.log(addTen(2));
var _ = require("ramda");

var curry = _.curry;

var match = curry(function(what, str) {
	return str.match(what);
});

var replace = curry(function(what, replacement, str) {
	return str.replace(what, replacement);
});

var filter = curry(function(f, ary) {
	return ary.filter(f);
});

var map = curry(function(f, ary) {
	return ary.map(f);
});

var hasSpace = match(/\s+/g);

console.log(hasSpace("hello world"));

var findspaces = filter(hasSpace);

console.log(findspaces(["tori_spelling", "hello world"]));

var noVowels = replace(/[aeiou]/ig);

var censored = noVowels("*");

console.log(censored("Chocolate Rain"));

var getChildren = function(x) {
	return x.childNodes;
};

//var allTheChildren = map(getChildren);
//var allTheChildren = function(elements) {
//	return _.map(elements, getChildren);
//};

//allTheChildren(["hhh", "ggg"]);

var splite = curry(function(what, str) {
	return str.split(what);
});

var words = splite(' ');

console.log(words("hello world"));

//var filterQs = function(xs) {
//	return filter(function(x) {return match(/[h]/, x);}, xs);
//};

var filterQs = filter(match(/[h]/));

console.log(filterQs(["hello", "world"]));

var _keepHighest = function(x, y) {
	return x >= y ? x : y;
};

var reduce = curry(function(f, def, xs) {
	return xs.reduce(f, def);
});

var max = reduce(_keepHighest, -Infinity);

console.log(max([1, 2, 3]));

var compose = function() {
	var args = arguments;
	return function(x) {
		var last = x;
		for (var i = args.length - 1; i >= 0 ; i--) {
			//console.log(arguments[i]);
			last = args[i](last);
		}
		return last;
	};
	
};

var toUppercase = function(x) {
	return x.toUpperCase();
};

var exclaim = function(x) {
	return x + '!';
};

var shout = compose(exclaim, toUppercase);

console.log(shout("send to the clowns"));

var head = function(x) {
	return x[0];
};

var reverse = reduce(function(acc, x) { return [x].concat(acc); }, []);
var last = compose(head, reverse);

//console.log(last(["jumpkick", "roundhouse", "uppercut"]));

//var upperCaseHead = compose(compose(toUppercase, head), reverse);

//console.log(upperCaseHead(["jumpkick", "roundhouse", "uppercut"]));

var lastUpper = compose(toUppercase, head, reverse);

console.log(lastUpper(["jumpkick", "roundhouse", "uppercut"]));

//var snakeCase = function(word) {
//	return word.toLowerCase().replace(/\s+/ig, '_');
//};

var toLowerCase = function(x) {
	return x.toLowerCase();
};

var snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);

console.log(snakeCase("HELLO WORLD"));

var join = curry(function(str, xs) {
	return xs.join(str);
});

var split = curry(function(str, x) {
	return x.split(str);
});

var initials = compose(join('. '), map(compose(toUppercase, head)), split(' '));

console.log(initials("hunter stockton thompson"));

var trace = curry(function(tag, x) {
	console.log(tag, x);
	return x;
});

var dasherize = compose(join('-'), map(toLowerCase), trace("after splite"), split(' '), replace(/\s{2,}/ig, ' '));

console.log(dasherize("The world is a vampire"));

var id = function(x) {
	return x;
};

var concat = curry(function(str, src) {
	return src.concat(str);
});

var Container = function(x) {
	this.__value = x;
	console.log(x);
};

Container.of = function(x) {
	return new Container(x);
};

Container.prototype.map = function(f) {
	return Container.of(f(this.__value));
};

Container.of(2).map(function(two) { return two + 2; });

Container.of("flamethrowers").map(function(s) { return s.toUpperCase();});

Container.of("bombs").map(concat(' away')).map(_.prop('length'));

var Maybe = function(x) {
	this.__value = x;
};

Maybe.of = function(x) {
	return new Maybe(x);
};

Maybe.prototype.isNothing = function() {
	return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.map = function(f){
	return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

Maybe.of("Malkovich Malkovich").map(match(/a/ig));

Maybe.of({name:"Dinah", age:14}).map(_.prop("age")).map(add(10));

Maybe.of({name:"Boris"}).map(_.prop("age")).map(add(10));

var map = curry(function(f, any_functor_at_all) {
	return any_functor_at_all.map(f);
});

var safeHead = function(xs) {
	return Maybe.of(xs[0]);
};

var streetName = compose(map(_.prop('street')), safeHead, _.prop('addresses'));

console.log(streetName({addresses: [{street: "Shady Ln.", number: 4201}]}));