
goog.provide("node.crypto.Sign");

/**
 * @constructor
 */
node.crypto.Sign = function() {};

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.global = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.process = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.GLOBAL = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.root = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.console = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.nclosure = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.COMPILED = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.goog = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.top = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.window = null;

/**
 * @type {string|null}
 */
node.crypto.Sign.prototype.module = null;

/**
 *
 */
node.crypto.Sign.prototype.setTimeout = function() {
  return node.crypto.Sign.core_.setTimeout.apply(node.crypto.Sign.core_, arguments);
};

/**
 *
 */
node.crypto.Sign.prototype.setInterval = function() {
  return node.crypto.Sign.core_.setInterval.apply(node.crypto.Sign.core_, arguments);
};

/**
 *
 */
node.crypto.Sign.prototype.clearTimeout = function() {
  return node.crypto.Sign.core_.clearTimeout.apply(node.crypto.Sign.core_, arguments);
};

/**
 *
 */
node.crypto.Sign.prototype.clearInterval = function() {
  return node.crypto.Sign.core_.clearInterval.apply(node.crypto.Sign.core_, arguments);
};

/**
 * @param {string} path
 */
node.crypto.Sign.prototype.require = function(path) {
  return node.crypto.Sign.core_.require.apply(node.crypto.Sign.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.crypto.Sign.core_ = require("crypto").Sign;