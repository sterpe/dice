exports.Source = function (s) {
	return {
		currentPosition: -1
		, nextChar: function () {
			this.currentPosition++;
			return this.currentChar();
		}
		, currentChar: function () {
			if (this.currentPosition === -1) {
				return this.nextChar();
			}
			return s.charAt(this.currentPosition) || null;
		}
		, value: function () {
			return s;
		}
		, peekChar: function () {
			return s.charAt(this.currentPosition + 1) || null;
		}
	};
};
