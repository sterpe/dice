exports.Parser = function (scanner) {
	return {
		parse: function () {
			var token
			;
			token = scanner.nextToken();
			while (token !== null) {
				this.tokenStream.push({
					type: token.type
					, text: token.text
					, value: token.value
					, position: token.position
				});
				token = scanner.nextToken();
			}
		}
		, tokenStream: []
	};
};
