const file = "../";

jest.dontMock(file);

describe([
	"dice#roll"
].join(" "),
function () {
	it([
		"should cast lots and return the results"
	].join(" "),
	function () {
		const dice = require(file);
		const Random = require('random-js');
		Random.__setMockRandomIntegers(4,5);
	
		expect(dice.roll("2d6")).toEqual({
			expression: "2d6",
			sides: 6,
			dice: 2,
			roll: 9,
			max: 12,
			min: 2,
			rolls: [4, 5]
		});
		expect(Random.integer.mock.calls.length).toBe(2);
		expect(Random.integer.mock.calls[0])
			.toEqual(Random.integer.mock.calls[1]);
		expect(Random.integer.mock.calls[0]).toEqual([1, 6]);
	});

});
