var Source = require('./lib/source').Source
, Scanner = require('./lib/scanner').Scanner
, Parser = require('./lib/parser').Parser
, Iterator = require('./lib/iterator').Iterator
, die = require('./lib/die')
, _ = require('lodash')
, getExpression
;

getExpression = function (normalizedList) {
	var expression = ""
	, l = normalizedList.length
	, values
	, i
	, j
	, k
	, explen
	, d
	;
	for (var i = 0; i < l; i++) {
		values = normalizedList[i].values;
		k = values.length;
		d = normalizedList[i].d;
		for (var j = 0; j < k; j++) {
			explen = expression.length;
			if (explen > 0 || values[j] < 0) {
				expression += (explen > 0 ? " " : "") + (values[j] < 0 ? "-" : "+") + (explen > 0 ? " " : "");
			}
			if (d === 0) {
				expression += "" + Math.abs(values[j]);
			} else {
				expression += "" + Math.abs(values[j]) + "d" + normalizedList[i].d;
			}
		}
	}
	return expression;
};
exports.Expression = function (exp) {
	var s = exp === "" ? "0" : exp
	, source = new Source(s)
	, scanner = new Scanner(source)
	, parser = new Parser(scanner)
	, normalizedList = []
	, normalizedExpression
	, condensedList = []
	, condensedExpression
	, iterate = function (fn, thisArg) {
		var iterator = new Iterator(parser.tokenStream)
		, token = iterator.next()
		;
	
		while (token) {
			fn.call(thisArg || null, token);
			token = iterator.next();
		}
	}
	, traverse = function (dieFunction) {
		var stack = [0]
		, lastOperator = []
		, operator = '+'
		;
		
		iterate(function (token) {
			if (token.type === "OPERATOR") {
				if (lastOperator.length) {
					throw new Error("Syntax Error: 2 operators in a row.")
				}
				operator = token.value;
				lastOperator.push(token);
			} else {
				firstOperand = stack.pop();
				secondOperand = token;
				secondOperand = token.type === "NUMBER" ? token.value : dieFunction(token.value, operator);
				if (operator === '+') {
					value = firstOperand + secondOperand;
				} else if (operator === '-') {
					value = firstOperand - secondOperand;
				} else {
					//if operator is null there is no operator between these two expressions
					throw new Error("Syntax Error");
				}
				stack.push(value);
				operator = null;
				lastOperator.pop();
			}
		});
		return stack.pop();
	}
	;

	parser.parse();

	return {
		evaluate: function () {
			return traverse(die.roll);
		}
		, hi: function () {
			return traverse(die.hi);
		}
		, maximum: function () {
			return traverse(die.max);
		}
		, normalize: function () {
			var iterator = new Iterator(parser.tokenStream)
			, token = iterator.next()
			, hashMap = { 0: [] }
			, lastOperator = []
			, operator = '+'
			, expression
			, sides
			, dice
			;
			;
			if (normalizedExpression) {
				return normalizedExpression;
			}
			while (token) {
				if (token.type === "OPERATOR") {
					if (lastOperator.length) {
						throw new Error("Operator without 2 operands");
					}
					operator = token.value;
					lastOperator.push(token);
				} else {
					if (operator !== "+" && operator !== "-") {
						throw new Error("Syntax Error");
					}
					if (token.type === "NUMBER") {
						hashMap[0].push((operator === "+") ? token.value : -1 * token.value);
					} else {
						expression = token.value.split("d");
						dice = expression[0] || '1'
						sides = expression[1];
						sides = sides === "%" ? 100 : parseInt(sides, 10);
						dice = parseInt(dice);
						hashMap[sides] = hashMap[sides] || [];
						hashMap[sides].push((operator === "+") ? dice : -1 * dice);
					}
					operator = null;
					lastOperator.pop();
				}
				token = iterator.next();
			}
			_.each(hashMap, function (property, key, hashMap) {
				hashMap[key] = property.sort(function (a, b) {
					if (a > b) {
						return -1;
					} else if (a < b) {
						return 1;
					} 
					return 0;
				});
				normalizedList.push({ d: parseInt(key, 10), values: hashMap[key] });
				normalizedList = normalizedList.sort(function (a, b) {
					if (a.d > b.d) {
						return -1;
					} else if (a.d < b.d) {
						return 1;
					}
					return 0;
				});
			});
			normalizedExpression = getExpression(normalizedList);
			return normalizedExpression;
		}
		, condense: function () {
			if (condensedExpression) {
				return condensedExpression;
			}
			this.normalize();
			for (var i = 0; i < normalizedList.length; ++i) {
				var positiveSum = undefined
				, negativeSum = undefined
				;
				for (var j = 0; j < normalizedList[i].values.length; ++j) {
					if (normalizedList[i].values[j] > 0) {
						positiveSum = positiveSum || 0;
						positiveSum += normalizedList[i].values[j];
					} else {
						negativeSum = negativeSum || 0;
						negativeSum += normalizedList[i].values[j];
					}
				}
				var values = [];
				if (positiveSum !== undefined) {
					values.push(positiveSum);
				}
				if (negativeSum !== undefined) {
					values.push(negativeSum);
				}
				condensedList.push({
					d: normalizedList[i].d
					, values: values
				});
			}
			return condensedExpression = getExpression(condensedList);
		}
	};
};
