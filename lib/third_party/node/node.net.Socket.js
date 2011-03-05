
goog.provide("node.net.Socket");

goog.require("node.buffer.Buffer");

/**
 * @constructor
 */
node.net.Socket = function() {};

/**
 * @type {node.buffer.Buffer|null}
 */
node.net.Socket.prototype.bufferSize = null;

/**
 * @type {string|null}
 */
node.net.Socket.prototype.fd = null;

/**
 * @type {string|null}
 */
node.net.Socket.prototype.type = null;

/**
 * @type {string|null}
 */
node.net.Socket.prototype.allowHalfOpen = null;

/**
 * @param {string} fd
 * @param {string} type
 */
node.net.Socket.prototype.open = function(fd, type) {
  return node.net.Socket.core_.open.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} data
 * @param {string} [fd]
 * @param {string} [cb]
 */
node.net.Socket.prototype.write = function(data, [fd], [cb]) {
  return node.net.Socket.core_.write.apply(node.net.Socket.core_, arguments);
};

/**
 *
 */
node.net.Socket.prototype.flush = function() {
  return node.net.Socket.core_.flush.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string=} encoding
 */
node.net.Socket.prototype.setEncoding = function(encoding) {
  return node.net.Socket.core_.setEncoding.apply(node.net.Socket.core_, arguments);
};

/**
 *
 */
node.net.Socket.prototype.connect = function() {
  return node.net.Socket.core_.connect.apply(node.net.Socket.core_, arguments);
};

/**
 *
 */
node.net.Socket.prototype.address = function() {
  return node.net.Socket.core_.address.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} v
 */
node.net.Socket.prototype.setNoDelay = function(v) {
  return node.net.Socket.core_.setNoDelay.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} enable
 * @param {string} time
 */
node.net.Socket.prototype.setKeepAlive = function(enable, time) {
  return node.net.Socket.core_.setKeepAlive.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} msecs
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.net.Socket.prototype.setTimeout = function(msecs, callback) {
  return node.net.Socket.core_.setTimeout.apply(node.net.Socket.core_, arguments);
};

/**
 *
 */
node.net.Socket.prototype.pause = function() {
  return node.net.Socket.core_.pause.apply(node.net.Socket.core_, arguments);
};

/**
 *
 */
node.net.Socket.prototype.resume = function() {
  return node.net.Socket.core_.resume.apply(node.net.Socket.core_, arguments);
};

/**
 *
 */
node.net.Socket.prototype.destroySoon = function() {
  return node.net.Socket.core_.destroySoon.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} exception
 */
node.net.Socket.prototype.destroy = function(exception) {
  return node.net.Socket.core_.destroy.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} data
 * @param {string=} encoding
 */
node.net.Socket.prototype.end = function(data, encoding) {
  return node.net.Socket.core_.end.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} dest
 * @param {Object} options
 */
node.net.Socket.prototype.pipe = function(dest, options) {
  return node.net.Socket.core_.pipe.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} n
 */
node.net.Socket.prototype.setMaxListeners = function(n) {
  return node.net.Socket.core_.setMaxListeners.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Socket.prototype.emit = function(type) {
  return node.net.Socket.core_.emit.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Socket.prototype.addListener = function(type, listener) {
  return node.net.Socket.core_.addListener.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Socket.prototype.on = function(type, listener) {
  return node.net.Socket.core_.on.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Socket.prototype.once = function(type, listener) {
  return node.net.Socket.core_.once.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Socket.prototype.removeListener = function(type, listener) {
  return node.net.Socket.core_.removeListener.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Socket.prototype.removeAllListeners = function(type) {
  return node.net.Socket.core_.removeAllListeners.apply(node.net.Socket.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Socket.prototype.listeners = function(type) {
  return node.net.Socket.core_.listeners.apply(node.net.Socket.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.net.Socket.core_ = require("net").Socket;