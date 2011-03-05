/**
 * @name node.sys
 * @namespace
 */

goog.provide("node.sys");

goog.require("node.stream.Stream");

/**
 *
 */
node.sys.print = function() {
  return node.sys.core_.print.apply(node.sys.core_, arguments);
};

/**
 *
 */
node.sys.puts = function() {
  return node.sys.core_.puts.apply(node.sys.core_, arguments);
};

/**
 * @param {string} x
 */
node.sys.debug = function(x) {
  return node.sys.core_.debug.apply(node.sys.core_, arguments);
};

/**
 * @param {string} x
 */
node.sys.error = function(x) {
  return node.sys.core_.error.apply(node.sys.core_, arguments);
};

/**
 * @param {Object} obj
 * @param {string} showHidden
 * @param {number} depth
 * @param {string} colors
 */
node.sys.inspect = function(obj, showHidden, depth, colors) {
  return node.sys.core_.inspect.apply(node.sys.core_, arguments);
};

/**
 *
 */
node.sys.p = function() {
  return node.sys.core_.p.apply(node.sys.core_, arguments);
};

/**
 * @param {string} msg
 */
node.sys.log = function(msg) {
  return node.sys.core_.log.apply(node.sys.core_, arguments);
};

/**
 *
 */
node.sys.exec = function() {
  return node.sys.core_.exec.apply(node.sys.core_, arguments);
};

/**
 * @param {node.stream.Stream} readStream
 * @param {node.stream.Stream} writeStream
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.sys.pump = function(readStream, writeStream, callback) {
  return node.sys.core_.pump.apply(node.sys.core_, arguments);
};

/**
 * @param {Function} ctor
 * @param {Function} superCtor
 */
node.sys.inherits = function(ctor, superCtor) {
  return node.sys.core_.inherits.apply(node.sys.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.sys.core_ = require("sys");