"use strict";

const Random = require('random-js');
const sprintf = require('sprintf-js').sprintf;
const engine = Random.engines.mt19937().autoSeed();

const e = "`%s' is not a valid dice expression.";

module.exports = {
	parse: function (expression) {
		let dice, sides;

		if (/^(?:[1-9][0-9]*)?(?:d|D)(?:[1-9][0-9]*|\%)/.test(expression)) {
			expression = expression.toLowerCase();
			expression = expression.split('d');
			sides = expression.pop();
			dice = expression.pop();
		} else {
			throw new Error(sprintf(e, expression));
		}
		return {
			dice: dice ? parseInt(dice, 10) : 1,
			sides: sides === '%' ? 100 : parseInt(sides, 10)
		};
	},
	roll: function (expression) {
		const d = this.parse(expression);
		const rolls = [];
		let total = 0;
		let i = 0;
		for (; i < d.dice; i++) {
			let roll = Random.integer(1, d.sides)(engine);
			total += roll;
			rolls.push(roll);
		}
		return {
			expression: expression,
			dice: d.dice,
			sides: d.sides,
			roll: total,
			max: this._max(d.dice, d.sides),
			min: this._min(d.dice, d.sides),
			rolls: rolls
		};
	},
	_max: function (dice, sides) {
		return dice * sides;
	},
	_min: function (dice, sides) {
		return dice;
	},
	max: function (expression) {
		let d = this.parse(expression);

		return this._max(d.dice, d.sides);
	},
	min: function (expression) {
		let d = this.parse(expression);

		return this._min(d.dice, d.sides);
	}
};
