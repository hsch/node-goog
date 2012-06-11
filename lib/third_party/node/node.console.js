/**
 * @name node.console
 * @namespace
 */

goog.provide("node.console");

/**
 *
 */
node.console.log = function() {
  return node.console.core_.log.apply(node.console.core_, arguments);
};

/**
 *
 */
node.console.info = function() {
  return node.console.core_.info.apply(node.console.core_, arguments);
};

/**
 *
 */
node.console.warn = function() {
  return node.console.core_.warn.apply(node.console.core_, arguments);
};

/**
 *
 */
node.console.error = function() {
  return node.console.core_.error.apply(node.console.core_, arguments);
};

/**
 * @param {string} object
 */
node.console.dir = function(object) {
  return node.console.core_.dir.apply(node.console.core_, arguments);
};

/**
 * @param {string} label
 */
node.console.time = function(label) {
  return node.console.core_.time.apply(node.console.core_, arguments);
};

/**
 * @param {string} label
 */
node.console.timeEnd = function(label) {
  return node.console.core_.timeEnd.apply(node.console.core_, arguments);
};

/**
 * @param {string} label
 */
node.console.trace = function(label) {
  return node.console.core_.trace.apply(node.console.core_, arguments);
};

/**
 * @param {string} expression
 */
node.console.assert = function(expression) {
  return node.console.core_.assert.apply(node.console.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.console.core_ = require("console");