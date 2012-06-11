/**
 * @name node.assert
 * @namespace
 * This module is used for writing unit tests for your applications, you can
 * access it with <code>require('assert')</code>.
 */

goog.provide("node.assert");

/**
 * Tests if <code>actual</code> is equal to <code>expected</code> using the operator provided.
 * @param {*} actual
 * @param {*} expected
 * @param {string} message
 * @param {function(*,*):boolean} operator
 * @param {string} stackStartFunction
 */
node.assert.fail = function(actual, expected, message, operator, stackStartFunction) {
  return node.assert.core_.fail.apply(node.assert.core_, arguments);
};

/**
 * Tests if value is a <code>true</code> value, it is equivalent to <code>assert.equal(true, value, message);</code>
 * @param {string} value
 * @param {string} message
 */
node.assert.ok = function(value, message) {
  return node.assert.core_.ok.apply(node.assert.core_, arguments);
};

/**
 * Tests shallow, coercive equality with the equal comparison operator ( <code>==</code> ).
 * @param {*} actual
 * @param {*} expected
 * @param {string} message
 */
node.assert.equal = function(actual, expected, message) {
  return node.assert.core_.equal.apply(node.assert.core_, arguments);
};

/**
 * Tests shallow, coercive non-equality with the not equal comparison operator ( <code>!=</code> ).
 * @param {*} actual
 * @param {*} expected
 * @param {string} message
 */
node.assert.notEqual = function(actual, expected, message) {
  return node.assert.core_.notEqual.apply(node.assert.core_, arguments);
};

/**
 * Tests for deep equality.
 * @param {*} actual
 * @param {*} expected
 * @param {string} message
 */
node.assert.deepEqual = function(actual, expected, message) {
  return node.assert.core_.deepEqual.apply(node.assert.core_, arguments);
};

/**
 * Tests for any deep inequality.
 * @param {*} actual
 * @param {*} expected
 * @param {string} message
 */
node.assert.notDeepEqual = function(actual, expected, message) {
  return node.assert.core_.notDeepEqual.apply(node.assert.core_, arguments);
};

/**
 * Tests strict equality, as determined by the strict equality operator ( <code>===</code> )
 * @param {*} actual
 * @param {*} expected
 * @param {string} message
 */
node.assert.strictEqual = function(actual, expected, message) {
  return node.assert.core_.strictEqual.apply(node.assert.core_, arguments);
};

/**
 * Tests strict non-equality, as determined by the strict not equal operator ( <code>!==</code> )
 * @param {*} actual
 * @param {*} expected
 * @param {string} message
 */
node.assert.notStrictEqual = function(actual, expected, message) {
  return node.assert.core_.notStrictEqual.apply(node.assert.core_, arguments);
};

/**
 * Expects <code>block</code> not to throw an error, see assert.throws for details.
 * @param {string} block
 * @param {string=} error
 * @param {string=} message
 */
node.assert.doesNotThrow = function(block, error, message) {
  return node.assert.core_.doesNotThrow.apply(node.assert.core_, arguments);
};

/**
 * Tests if value is not a false value, throws if it is a true value. Useful when
 * testing the first argument, <code>error</code> in callbacks.
 * @param {Error} err
 */
node.assert.ifError = function(err) {
  return node.assert.core_.ifError.apply(node.assert.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.assert.core_ = require("assert");