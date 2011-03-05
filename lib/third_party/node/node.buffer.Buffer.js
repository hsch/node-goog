
goog.provide("node.buffer.Buffer");

/**
 * @constructor
 */
node.buffer.Buffer = function() {};

/**
 * @type {number|null}
 */
node.buffer.Buffer.prototype.poolSize = null;

/**
 * @param {string} b
 */
node.buffer.Buffer.prototype.isBuffer = function(b) {
  return node.buffer.Buffer.core_.isBuffer.apply(node.buffer.Buffer.core_, arguments);
};

/**
 *
 */
node.buffer.Buffer.prototype.byteLength = function() {
  return node.buffer.Buffer.core_.byteLength.apply(node.buffer.Buffer.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.buffer.Buffer.core_ = require("buffer").Buffer;