var _ = require('lodash');
var Token = function (source, options) {
	var t = _.extend({
		source: source
		, type: "CHAR"
		, text: undefined
		, value: undefined
		, position: source.currentPosition
		, currentChar: function () {
			return this.source.currentChar();
		}
		, peekChar: function () {
			return this.source.peekChar();
		}
		, nextChar: function () {
			return this.source.nextChar();
		}
		, extract: function () {
			this.text = this.currentChar();
			this.value = null;
			this.nextChar();
		}
	}, options || {});

	return t.extract(), t;
};
var OperatorToken = function (source) {
	return Token(source, {
		type: "OPERATOR"
		, extract: function () {
			this.text = this.currentChar();
			this.value = this.currentChar();
			this.nextChar();
		}
	});
};
var DiceOrValueToken = function (source) {
	return Token(source, {
		type: "NUMBER"
		, extract: function () {
			var s = ""
			, prevChar = undefined
			;
			while (/^[0-9]*$/.test(s + this.currentChar())) {
				s += this.currentChar();
				this.nextChar();
			}
			if (this.currentChar() !== null && this.currentChar().toLowerCase() === 'd') {
				this.type= "ROLL";
				while(/^[0-9]*(?:d|D)(?:[0-9]*|%)$/.test(s + this.currentChar())) {
					s += this.currentChar();
					this.nextChar();
				}
			}
			this.text = s;
			this.value = this.type === "NUMBER" ? parseInt(s, 10) : s;
			return;
		}
	});
};
exports.Scanner = function (source) {
	return {
		skipWhitespace: function () {
			while(/\s/.test(source.currentChar())) {
				source.nextChar();
			}
		}
		, nextToken: function () {
		
			this.skipWhitespace();
			if (/^(?:\+|\-)/.test(source.currentChar())) {
				return OperatorToken(source);
			} else if (/^(?:[0-9]|d|D)/.test(source.currentChar())) {
				return DiceOrValueToken(source);
			} else if (source.currentChar() === null) {
				return null;
			} else {
				throw new Error("Not a valid DiceExpression!");
			}
		}
	};
};
