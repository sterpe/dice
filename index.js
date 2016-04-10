'use strict'

var Random = require('random-js')
var sprintf = require('sprintf-js').sprintf
var CONSTANT = require('dice-constants')
var engine = Random.engines.mt19937().autoSeed()
var DiceExpressionParser = require('dice-expression-parser')

var e = '`%s\' is not a valid dice expression.'

function parse (expression) {
  var dice, sides

  if (/^(?:[1-9][0-9]*)?(?:d|D)(?:[1-9][0-9]*|\%)/.test(expression)) {
    expression = expression.toLowerCase()
    expression = expression.split('d')
    sides = expression.pop()
    dice = expression.pop()
  } else {
    throw new Error(sprintf(e, expression))
  }
  return {
    dice: dice ? parseInt(dice, 10) : 1,
    sides: sides === '%' ? 100 : parseInt(sides, 10)
  }
}
function _max (dice, sides) {
  return dice * sides
}

function _min (dice, sides) {
  return dice
}
function roll (expression) {
  var d = parse(expression)
  var rolls = []
  var total = 0
  var i = 0
  for (; i < d.dice; i++) {
    var roll = Random.integer(1, d.sides)(engine)
    total += roll
    rolls.push(roll)
  }
  return {
    expression: expression,
    dice: d.dice,
    sides: d.sides,
    roll: total,
    max: _max(d.dice, d.sides),
    min: _min(d.dice, d.sides),
    rolls: rolls
  }
}
function DiceExpression (exp) {
  var parser = new DiceExpressionParser(exp)
  var tree = parser.parse()
  var sum

  function Iterator (fn) {
    var operator = '+'
    return function (node) {
      if (node.subType === CONSTANT.OPERATOR) {
        operator = node.value
      } else if (node.subType === CONSTANT.DIE) {
        if (operator === '+') {
          sum += fn(node.value)
        } else {
          sum -= fn(node.value)
        }
      } else {
        if (operator === '+') {
          sum += node.value
        } else {
          sum -= node.value
        }
      }
    }
  }
  function evaluate () {
    sum = 0
    visit(tree, Iterator(function (value) {
      return roll(value).roll
    }))
    return sum
  }

  function visit (node, fn) {
    if (node.left) {
      visit(node.left, fn)
    }
    fn(node)
    if (node.right) {
      visit(node.right, fn)
    }
  }
  evaluate.max = function () {
    sum = 0
    visit(tree, Iterator(function (value) {
      return roll(value).max
    }))
    return sum
  }
  evaluate.min = function () {
    sum = 0
    visit(tree, Iterator(function (value) {
      return roll(value).min
    }))
    return sum
  }
  return evaluate
}

module.exports = DiceExpression
