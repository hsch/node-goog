/**
 * @name node.readline
 * @namespace
 */

goog.provide("node.readline");

/**
 * @param {string} input
 * @param {string} output
 * @param {string} completer
 */
node.readline.createInterface = function(input, output, completer) {
  return node.readline.core_.createInterface.apply(node.readline.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.readline.core_ = require("readline");