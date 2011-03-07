
goog.provide("node.crypto.Decipher");

/**
 * @constructor
 */
node.crypto.Decipher = function() {};

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.global = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.process = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.GLOBAL = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.root = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.console = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.nclosure = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.COMPILED = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.goog = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.top = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.window = null;

/**
 * @type {string|null}
 */
node.crypto.Decipher.prototype.module = null;

/**
 *
 */
node.crypto.Decipher.prototype.setTimeout = function() {
  return node.crypto.Decipher.core_.setTimeout.apply(node.crypto.Decipher.core_, arguments);
};

/**
 *
 */
node.crypto.Decipher.prototype.setInterval = function() {
  return node.crypto.Decipher.core_.setInterval.apply(node.crypto.Decipher.core_, arguments);
};

/**
 *
 */
node.crypto.Decipher.prototype.clearTimeout = function() {
  return node.crypto.Decipher.core_.clearTimeout.apply(node.crypto.Decipher.core_, arguments);
};

/**
 *
 */
node.crypto.Decipher.prototype.clearInterval = function() {
  return node.crypto.Decipher.core_.clearInterval.apply(node.crypto.Decipher.core_, arguments);
};

/**
 * @param {string} path
 */
node.crypto.Decipher.prototype.require = function(path) {
  return node.crypto.Decipher.core_.require.apply(node.crypto.Decipher.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.crypto.Decipher.core_ = require("crypto").Decipher;