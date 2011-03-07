
goog.provide("node.crypto.Cipher");

/**
 * @constructor
 */
node.crypto.Cipher = function() {};

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.global = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.process = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.GLOBAL = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.root = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.console = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.nclosure = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.COMPILED = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.goog = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.top = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.window = null;

/**
 * @type {string|null}
 */
node.crypto.Cipher.prototype.module = null;

/**
 *
 */
node.crypto.Cipher.prototype.setTimeout = function() {
  return node.crypto.Cipher.core_.setTimeout.apply(node.crypto.Cipher.core_, arguments);
};

/**
 *
 */
node.crypto.Cipher.prototype.setInterval = function() {
  return node.crypto.Cipher.core_.setInterval.apply(node.crypto.Cipher.core_, arguments);
};

/**
 *
 */
node.crypto.Cipher.prototype.clearTimeout = function() {
  return node.crypto.Cipher.core_.clearTimeout.apply(node.crypto.Cipher.core_, arguments);
};

/**
 *
 */
node.crypto.Cipher.prototype.clearInterval = function() {
  return node.crypto.Cipher.core_.clearInterval.apply(node.crypto.Cipher.core_, arguments);
};

/**
 * @param {string} path
 */
node.crypto.Cipher.prototype.require = function(path) {
  return node.crypto.Cipher.core_.require.apply(node.crypto.Cipher.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.crypto.Cipher.core_ = require("crypto").Cipher;