
goog.provide("node.crypto.Verify");

/**
 * @constructor
 */
node.crypto.Verify = function() {};

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.global = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.process = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.GLOBAL = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.root = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.console = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.nclosure = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.COMPILED = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.goog = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.top = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.window = null;

/**
 * @type {string|null}
 */
node.crypto.Verify.prototype.module = null;

/**
 *
 */
node.crypto.Verify.prototype.setTimeout = function() {
  return node.crypto.Verify.core_.setTimeout.apply(node.crypto.Verify.core_, arguments);
};

/**
 *
 */
node.crypto.Verify.prototype.setInterval = function() {
  return node.crypto.Verify.core_.setInterval.apply(node.crypto.Verify.core_, arguments);
};

/**
 *
 */
node.crypto.Verify.prototype.clearTimeout = function() {
  return node.crypto.Verify.core_.clearTimeout.apply(node.crypto.Verify.core_, arguments);
};

/**
 *
 */
node.crypto.Verify.prototype.clearInterval = function() {
  return node.crypto.Verify.core_.clearInterval.apply(node.crypto.Verify.core_, arguments);
};

/**
 * @param {string} path
 */
node.crypto.Verify.prototype.require = function(path) {
  return node.crypto.Verify.core_.require.apply(node.crypto.Verify.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.crypto.Verify.core_ = require("crypto").Verify;