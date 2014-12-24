// The famous expression problem, tackled using Protocols

var Protocol = require('./protocols');
var assert = require('assert');

var Expression = Protocol({
	eval: 'Evaluate the expression to produce a result',
	show: 'provide a string representation of the expression',
	isPositive: function (exp) {
		return Expression.eval(exp) > 0;
	},
});

Expression.extendTo(Number, {
	eval: function (x) {
		return x;
	},
	show: function (x) {
		return String(x);
	},
});

function Add(x, y) {
	if (!(this instanceof Add)) return new Add(x, y);
	this.x = x;
	this.y = y;
}

Expression.extendTo(Add, {
	eval: function (add) {
		return Expression.eval(add.x) + Expression.eval(add.y);
	},
	show: function (add) {
		return '(' + Expression.show(add.x) + 
			' + ' + Expression.show(add.y) + ')';
	}
});

function Multiply(x, y) {
	if (!(this instanceof Multiply)) return new Multiply(x, y);
	this.x = x;
	this.y = y;
}

Expression.extendTo(Multiply, {
	eval: function (multiply) {
		return Expression.eval(multiply.x) * Expression.eval(multiply.y);
	},
	show: function (multiply) {
		return '(' + Expression.show(multiply.x) + 
			' * ' + Expression.show(multiply.y) + ')';
	},
	isPositive: function (multiply) {
		return 	Expression.isPositive(multiply.x) && 
				Expression.isPositive(multiply.y);
	},
});

Expression.extendTo(null, {
	eval: function () {
		return 0;
	},
	show: function () {
		return 'null';
	}
});

function Succ(x) {
	if (!(this instanceof Succ)) return new Succ(x);
	this.x = x;
	this.y = 1;
}
Succ.prototype = Object.create(Add.prototype);

//try {
	assert.strictEqual(Expression.eval(12), 12);
	assert.strictEqual(Expression.show(12), '12');

	assert.strictEqual(Expression.eval(Add(7, 5)), 12);
	assert.strictEqual(Expression.eval(Add(12.5, Add(2.5, 5))), 20);
	assert.strictEqual(Expression.show(Add(7, 5)), '(7 + 5)');

	assert.strictEqual(Expression.eval(Multiply(3, 4)), 12);
	assert.strictEqual(Expression.eval(Multiply(5, Multiply(2.5, 10))), 125);
	assert.strictEqual(Expression.show(Multiply(3, 4)), '(3 * 4)');

	assert.strictEqual(Expression.eval(Succ(6)), 7);
	assert.strictEqual(Expression.show(Succ(6)), '(6 + 1)');

	assert.strictEqual(Expression.isPositive(12), true);
	assert.strictEqual(Expression.isPositive(-4), false);
	assert.strictEqual(Expression.isPositive(Add(-1, 5)), true);
	assert.strictEqual(Expression.isPositive(Multiply(-1, 5)), false);

	assert.strictEqual(Expression.supports(Number), true);
	assert.strictEqual(Expression.supports(Add), true);
	assert.strictEqual(Expression.supports(Multiply), true);
	assert.strictEqual(Expression.supports(null), true);
	assert.strictEqual(Expression.supports(Succ), true);
	assert.strictEqual(Expression.supports(String), false);

	console.log('All tested passed');
//}
//catch (e) {
//	console.log('Test failed:', e.message);
//}