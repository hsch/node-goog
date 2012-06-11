
goog.provide("node.net.Stream");

goog.require("node.buffer.Buffer");

/**
 * @constructor
 */
node.net.Stream = function() {};

/**
 * @type {node.buffer.Buffer|null}
 */
node.net.Stream.prototype.bufferSize = null;

/**
 * @type {string|null}
 */
node.net.Stream.prototype.fd = null;

/**
 * @type {string|null}
 */
node.net.Stream.prototype.type = null;

/**
 * @type {string|null}
 */
node.net.Stream.prototype.allowHalfOpen = null;

/**
 * @param {string} fd
 * @param {string} type
 */
node.net.Stream.prototype.open = function(fd, type) {
  return node.net.Stream.core_.open.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} data
 * @param {string} [fd]
 * @param {string} [cb]
 */
node.net.Stream.prototype.write = function(data, [fd], [cb]) {
  return node.net.Stream.core_.write.apply(node.net.Stream.core_, arguments);
};

/**
 *
 */
node.net.Stream.prototype.flush = function() {
  return node.net.Stream.core_.flush.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string=} encoding
 */
node.net.Stream.prototype.setEncoding = function(encoding) {
  return node.net.Stream.core_.setEncoding.apply(node.net.Stream.core_, arguments);
};

/**
 *
 */
node.net.Stream.prototype.connect = function() {
  return node.net.Stream.core_.connect.apply(node.net.Stream.core_, arguments);
};

/**
 *
 */
node.net.Stream.prototype.address = function() {
  return node.net.Stream.core_.address.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} v
 */
node.net.Stream.prototype.setNoDelay = function(v) {
  return node.net.Stream.core_.setNoDelay.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} enable
 * @param {string} time
 */
node.net.Stream.prototype.setKeepAlive = function(enable, time) {
  return node.net.Stream.core_.setKeepAlive.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} msecs
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.net.Stream.prototype.setTimeout = function(msecs, callback) {
  return node.net.Stream.core_.setTimeout.apply(node.net.Stream.core_, arguments);
};

/**
 *
 */
node.net.Stream.prototype.pause = function() {
  return node.net.Stream.core_.pause.apply(node.net.Stream.core_, arguments);
};

/**
 *
 */
node.net.Stream.prototype.resume = function() {
  return node.net.Stream.core_.resume.apply(node.net.Stream.core_, arguments);
};

/**
 *
 */
node.net.Stream.prototype.destroySoon = function() {
  return node.net.Stream.core_.destroySoon.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} exception
 */
node.net.Stream.prototype.destroy = function(exception) {
  return node.net.Stream.core_.destroy.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} data
 * @param {string=} encoding
 */
node.net.Stream.prototype.end = function(data, encoding) {
  return node.net.Stream.core_.end.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} dest
 * @param {Object} options
 */
node.net.Stream.prototype.pipe = function(dest, options) {
  return node.net.Stream.core_.pipe.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} n
 */
node.net.Stream.prototype.setMaxListeners = function(n) {
  return node.net.Stream.core_.setMaxListeners.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Stream.prototype.emit = function(type) {
  return node.net.Stream.core_.emit.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Stream.prototype.addListener = function(type, listener) {
  return node.net.Stream.core_.addListener.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Stream.prototype.on = function(type, listener) {
  return node.net.Stream.core_.on.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Stream.prototype.once = function(type, listener) {
  return node.net.Stream.core_.once.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Stream.prototype.removeListener = function(type, listener) {
  return node.net.Stream.core_.removeListener.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Stream.prototype.removeAllListeners = function(type) {
  return node.net.Stream.core_.removeAllListeners.apply(node.net.Stream.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Stream.prototype.listeners = function(type) {
  return node.net.Stream.core_.listeners.apply(node.net.Stream.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.net.Stream.core_ = require("net").Stream;