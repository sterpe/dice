
"use strict";

const randomJSMock = jest.genMockFromModule("random-js");

randomJSMock.engines.mt19937.mockImplementation(function () {
	return {
		autoSeed: jest.genMockFn()
	};
});

const integers = [];

randomJSMock.__setMockRandomIntegers = function () {
	let i = 0;
	for(; i < arguments.length; i++) {
		integers.push(arguments[i]);
	}
};

randomJSMock.integer.mockImplementation(function () {
	return function () {
		return integers.shift();
	};
});

module.exports = randomJSMock;
