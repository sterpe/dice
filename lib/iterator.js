exports.Iterator = function (tokenStream, reverse) {
	var index = reverse ? tokenStream.length : -1
	;

	return {
		next: function () {
			reverse ? index-- : index++;
			if (index >= tokenStream.length || index < 0) {
				return null;
			}
			return tokenStream[index];
		}
	};
};
