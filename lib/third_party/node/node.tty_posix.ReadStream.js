
goog.provide("node.tty_posix.ReadStream");

goog.require("node.buffer.Buffer");

/**
 * @constructor
 */
node.tty_posix.ReadStream = function() {};

/**
 * @type {node.buffer.Buffer|null}
 */
node.tty_posix.ReadStream.prototype.bufferSize = null;

/**
 * @type {string|null}
 */
node.tty_posix.ReadStream.prototype.fd = null;

/**
 * @type {string|null}
 */
node.tty_posix.ReadStream.prototype.type = null;

/**
 * @type {string|null}
 */
node.tty_posix.ReadStream.prototype.allowHalfOpen = null;

/**
 * @type {boolean|null}
 */
node.tty_posix.ReadStream.prototype.isTTY = null;

/**
 * @param {string} fd
 * @param {string} type
 */
node.tty_posix.ReadStream.prototype.open = function(fd, type) {
  return node.tty_posix.ReadStream.core_.open.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} data
 * @param {string} [fd]
 * @param {string} [cb]
 */
node.tty_posix.ReadStream.prototype.write = function(data, [fd], [cb]) {
  return node.tty_posix.ReadStream.core_.write.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.ReadStream.prototype.flush = function() {
  return node.tty_posix.ReadStream.core_.flush.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string=} encoding
 */
node.tty_posix.ReadStream.prototype.setEncoding = function(encoding) {
  return node.tty_posix.ReadStream.core_.setEncoding.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.ReadStream.prototype.connect = function() {
  return node.tty_posix.ReadStream.core_.connect.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.ReadStream.prototype.address = function() {
  return node.tty_posix.ReadStream.core_.address.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} v
 */
node.tty_posix.ReadStream.prototype.setNoDelay = function(v) {
  return node.tty_posix.ReadStream.core_.setNoDelay.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} enable
 * @param {string} time
 */
node.tty_posix.ReadStream.prototype.setKeepAlive = function(enable, time) {
  return node.tty_posix.ReadStream.core_.setKeepAlive.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} msecs
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.tty_posix.ReadStream.prototype.setTimeout = function(msecs, callback) {
  return node.tty_posix.ReadStream.core_.setTimeout.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.ReadStream.prototype.pause = function() {
  return node.tty_posix.ReadStream.core_.pause.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.ReadStream.prototype.resume = function() {
  return node.tty_posix.ReadStream.core_.resume.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.ReadStream.prototype.destroySoon = function() {
  return node.tty_posix.ReadStream.core_.destroySoon.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} exception
 */
node.tty_posix.ReadStream.prototype.destroy = function(exception) {
  return node.tty_posix.ReadStream.core_.destroy.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} data
 * @param {string=} encoding
 */
node.tty_posix.ReadStream.prototype.end = function(data, encoding) {
  return node.tty_posix.ReadStream.core_.end.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} dest
 * @param {Object} options
 */
node.tty_posix.ReadStream.prototype.pipe = function(dest, options) {
  return node.tty_posix.ReadStream.core_.pipe.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} n
 */
node.tty_posix.ReadStream.prototype.setMaxListeners = function(n) {
  return node.tty_posix.ReadStream.core_.setMaxListeners.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_posix.ReadStream.prototype.emit = function(type) {
  return node.tty_posix.ReadStream.core_.emit.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.ReadStream.prototype.addListener = function(type, listener) {
  return node.tty_posix.ReadStream.core_.addListener.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.ReadStream.prototype.on = function(type, listener) {
  return node.tty_posix.ReadStream.core_.on.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.ReadStream.prototype.once = function(type, listener) {
  return node.tty_posix.ReadStream.core_.once.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.ReadStream.prototype.removeListener = function(type, listener) {
  return node.tty_posix.ReadStream.core_.removeListener.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_posix.ReadStream.prototype.removeAllListeners = function(type) {
  return node.tty_posix.ReadStream.core_.removeAllListeners.apply(node.tty_posix.ReadStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_posix.ReadStream.prototype.listeners = function(type) {
  return node.tty_posix.ReadStream.core_.listeners.apply(node.tty_posix.ReadStream.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.tty_posix.ReadStream.core_ = require("tty_posix").ReadStream;