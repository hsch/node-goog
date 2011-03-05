/**
 * @name node.child_process
 * @namespace
 */

goog.provide("node.child_process");

/**
 * @param {string} path
 * @param {Array.<*>} args
 * @param {Object} options
 * @param {string} customFds
 */
node.child_process.spawn = function(path, args, options, customFds) {
  return node.child_process.core_.spawn.apply(node.child_process.core_, arguments);
};

/**
 * @param {string} command
 * @param {Object} options
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.child_process.exec = function(command, options, callback) {
  return node.child_process.core_.exec.apply(node.child_process.core_, arguments);
};

/**
 * @param {string} file
 * @param {Object} options
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.child_process.execFile = function(file, options, callback) {
  return node.child_process.core_.execFile.apply(node.child_process.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.child_process.core_ = require("child_process");