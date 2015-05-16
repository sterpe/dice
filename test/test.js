var Expression = require('../index').Expression;
var d6 = Expression('2d6 + 20');

//console.log(Expression('1d6').evaluate());
//console.log(Expression('2d6 + 20'));
//console.log(Expression('20 + d% - 50+2d6'));
//console.log(Expression('d100'));
var r = [];
for (var i = 0; i < 6; ++i) {
	r.push(d6.evaluate());
}
console.log(r, d6.maximum());

var exp2 = Expression('20 + d% - 50 - 2d6');
console.log(exp2.normalize());
console.log(exp2.condense());

var exp3 = Expression("");
console.log(exp3.evaluate(), exp3.maximum(), exp3.normalize(), exp3.condense());
var exp4 = Expression("0");
console.log(exp4.evaluate(), exp4.maximum(), exp4.hi(), exp4.normalize(), exp4.condense());
var exp5 = Expression("1d6-2d6+2d3+5d8+6d3-1d8+10+20");
console.log(exp5.evaluate(), exp5.maximum(), exp5.hi(), exp5.normalize(), exp5.condense());
var exp6 = Expression("-1d6");
console.log(exp6.evaluate(), exp6.maximum(), exp6.hi(), exp6.normalize(), exp6.condense());
