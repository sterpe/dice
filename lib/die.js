var Random = require('random-js')
, engine = Random.engines.mt19937().autoSeed()
, summation = function (dieExpression, fn) {
	var sum = 0
	, dice
	, sides
	, i
	;

	if (/[0-9]*d(?:[0-9]+|%)/.test(dieExpression)) {
		dieExpression = dieExpression.split('d');
		sides = dieExpression.pop();
		sides = sides === '%' ? 100 : parseInt(sides, 10);
		dice = dieExpression.pop() || '1';
		dice = parseInt(dice, 10);
		sum = fn(dice, sides);
	} else {
		throw new Error("Not a valid dieExpression!");
	}
	
	return sum;
};

exports.roll = function (dieExpression) {
	return summation(dieExpression, function (dice, sides) {
		var sum = 0
		, i
		;
		for (i = 0; i < dice; i++) {
			sum += Random.integer(1, sides)(engine);
		}
		return sum;
	});
};
exports.max = function (dieExpression) {
	return summation(dieExpression, function (dice, sides) {
		return dice * sides;
	});
};
exports.hi = function (dieExpression, operator) {
	return summation(dieExpression, function (dice, sides) {
		if (operator === "+") {
			return dice * sides;
		} else if (operator === "-") {
			return dice * 1;
		}
	});
};
