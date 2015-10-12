const file = "../";

jest.dontMock(file);
jest.dontMock("random-js");

describe([
	"dice#parse"
].join(" "),
function () {

	it([
		"should parse the # of dice and die-type correctly, give xDy"
	].join(" "),
	function () {
		const dice = require(file);

		expect(dice.parse("2d6")).toEqual({
			dice: 2,
			sides: 6
		});
	});

	it([
		"should pare the # of dice as 1 given Dy"
	].join(" "),
	function () {
		const dice = require(file);

		expect(dice.parse("d6")).toEqual({
			dice: 1,
			sides: 6
		});
	});

	it([
		"should parse `d%` as d100"
	].join(" "),
	function () {
		const dice = require(file);

		expect(dice.parse("d%")).toEqual({
			dice:1,
			sides:100
		});
	});

	it([
		"should parse an uppercase 'D' okay"
	].join(" "),
	function () {
		const dice = require(file);

		expect(dice.parse("2D6")).toEqual({
			dice: 2,
			sides: 6
		});
	});

	it([
		"should throw an error on invalid dice expression"
	].join(" "),
	function () {
		const dice = require(file);
		const e = new Error("`2Dd6' is not a valid dice expression.");

		expect(function () {
			dice.parse("2Dd6");
		}).toThrow();
	});
});
