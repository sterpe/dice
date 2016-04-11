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
    max: _max(d.dice, d.sides),
    min: _min(d.dice, d.sides),
    sides: d.sides,
    roll: total,
    rolls: rolls
  }
}
function DiceExpression (exp) {
  var parser = new DiceExpressionParser(exp)
  var tree = parser.parse()
  evaluate.max = (function () {
    var sum = 0
    var operator = '+'
    visit(tree, function (node) {
      var r
      if (node.subType === CONSTANT.OPERATOR) {
        operator = node.value
      } else if (node.subType === CONSTANT.DIE) {
        if (operator === '+') {
          r = roll(node.value)
          sum += r.max
        } else {
          r = roll(node.value)
          sum -= r.max
        }
      } else {
        if (operator === '+') {
          sum += node.value
        } else {
          sum -= node.value
        }
      }
    })
    return sum
  }())
  evaluate.min = (function () {
    var sum = 0
    var operator = '+'
    visit(tree, function (node) {
      var r
      if (node.subType === CONSTANT.OPERATOR) {
        operator = node.value
      } else if (node.subType === CONSTANT.DIE) {
        if (operator === '+') {
          r = roll(node.value)
          sum += r.min
        } else {
          r = roll(node.value)
          sum -= r.min
        }
      } else {
        if (operator === '+') {
          sum += node.value
        } else {
          sum -= node.value
        }
      }
    })
    return sum
  }())
  evaluate.rolls = []
  function evaluate () {
    var sum = 0
    evaluate.rolls = []
    var operator = '+'
    visit(tree, function (node) {
      var r
      if (node.subType === CONSTANT.OPERATOR) {
        operator = node.value
      } else if (node.subType === CONSTANT.DIE) {
        if (operator === '+') {
          r = roll(node.value)
          sum += r.roll
          evaluate.rolls.push(r.rolls)
        } else {
          r = roll(node.value)
          sum -= r.roll
          evaluate.rolls.push(r.rolls.map(function (v) {
            return v * -1
          }))
        }
      } else {
        if (operator === '+') {
          sum += node.value
          evaluate.rolls.push([node.value])
        } else {
          sum -= node.value
          evaluate.rolls.push([-1 * node.value])
        }
      }
    })
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
  return evaluate
}

module.exports = DiceExpression
