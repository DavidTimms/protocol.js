var Benchmark = require('benchmark');
var Protocol = require('./protocols');


function Add(x, y) {
	this.x = x;
	this.y = y;
}
Add.prototype.add = function () {
	return this.x + this.y;
}

function add(addition) {
	return addition.x + addition.y;
}

var Addable = Protocol({
	add: 'Add x and y',
});

Addable.extendTo(Add, {
	add: add,
});

var additions = [];
for (var i = 0; i < 100; i++) {
	for (var j = 0; j < 10; j++) {
		additions.push(new Add(i, j));
	}
}

var suite = new Benchmark.Suite();

suite
	.add('Static function', function() {
		for (var i = 0; i < additions.length; i++) {
			add(additions[i]);
		}
	})
	.add('.call function', function() {
		for (var i = 0; i < additions.length; i++) {
			add.call(null, additions[i]);
		}
	})
	.add('.apply function', function() {
		for (var i = 0; i < additions.length; i++) {
			add.apply(null, [additions[i]]);
		}
	})
	.add('Normal method', function() {
		for (var i = 0; i < additions.length; i++) {
			additions[i].add();
		}
	})
	.add('Protocol', function() {
		for (var i = 0; i < additions.length; i++) {
			Addable.add(additions[i]);
		}
	})
	.on('complete', function() {
		this.forEach(function (bench) {
			console.log(pad(bench.name + ':', 20, ' ') + 
				padFront(String(bench.hz).split('.')[0], 12, ' ') + ' ops/sec');
		})
	})
	.run();

function pad(str, len, padChar) {
	while (str.length < len) {
		str += padChar;
	}
	return str;
}

function padFront(str, len, padChar) {
	while (str.length < len) {
		str = padChar + str;
	}
	return str;
}