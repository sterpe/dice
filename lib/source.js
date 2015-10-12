var initialPosition = -1
, Source
;

Source = function (source) {
	this.source = source;
	this.currentPosition = initialPosition;
};

Source.prototype.nextChar: function () {
	this.currentPosition++;
	return this.currentChar();
};

Source.prototype.currentChar: function () {
	if (this.currentPosition < 0) {
		return this.nextChar();
	}
	return this.source.charAt(this.currentPosition) || null;
};

Source.prototype.peekChar: function () {
	return this.source.charAt(this.currentPosition + 1) || null;
};

exports.Source = function (source) {
	return new Source(source);
};

//exports.Source = function (s) {
//	return {
//		currentPosition: -1
//		, nextChar: function () {
//			this.currentPosition++;
//			return this.currentChar();
//		}
//		, currentChar: function () {
//			if (this.currentPosition === -1) {
//				return this.nextChar();
//			}
//			return s.charAt(this.currentPosition) || null;
//		}
//		, value: function () {
//			return s;
//		}
//		, peekChar: function () {
//			return s.charAt(this.currentPosition + 1) || null;
//		}
//	};
//};
