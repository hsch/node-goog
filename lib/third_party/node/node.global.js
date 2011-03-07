/**
 * @name node.global
 * @namespace
 * These object are available in the global scope and can be accessed from anywhere.
 */

goog.provide("node.global");

/**
 * @type {string|null}
 */
node.global.global = null;

/**
 * @type {string|null}
 */
node.global.process = null;

/**
 * @type {string|null}
 */
node.global.GLOBAL = null;

/**
 * @type {string|null}
 */
node.global.root = null;

/**
 * @type {string|null}
 */
node.global.console = null;

/**
 * @type {string|null}
 */
node.global.nclosure = null;

/**
 * @type {string|null}
 */
node.global.COMPILED = null;

/**
 * @type {string|null}
 */
node.global.goog = null;

/**
 * @type {string|null}
 */
node.global.top = null;

/**
 * @type {string|null}
 */
node.global.window = null;

/**
 * @type {string|null}
 */
node.global.module = null;

/**
 *
 */
node.global.setTimeout = function() {
  return node.global.core_.setTimeout.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.setInterval = function() {
  return node.global.core_.setInterval.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.clearTimeout = function() {
  return node.global.core_.clearTimeout.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.clearInterval = function() {
  return node.global.core_.clearInterval.apply(node.global.core_, arguments);
};

/**
 * @param {string} path
 */
node.global.require = function(path) {
  return node.global.core_.require.apply(node.global.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.global.core_ = global;