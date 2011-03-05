
goog.provide("node.crypto.Cipher.Buffer");

/**
 * @constructor
 */
node.crypto.Cipher.Buffer = function() {};

/**
 * @type {number|null}
 */
node.crypto.Cipher.Buffer.prototype.poolSize = null;

/**
 * @param {string} b
 */
node.crypto.Cipher.Buffer.prototype.isBuffer = function(b) {
  return node.crypto.Cipher.Buffer.core_.isBuffer.apply(node.crypto.Cipher.Buffer.core_, arguments);
};

/**
 *
 */
node.crypto.Cipher.Buffer.prototype.byteLength = function() {
  return node.crypto.Cipher.Buffer.core_.byteLength.apply(node.crypto.Cipher.Buffer.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.crypto.Cipher.Buffer.core_ = require("crypto").Cipher.Buffer;