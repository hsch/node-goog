
goog.provide("node.tty_posix.WriteStream");

goog.require("node.buffer.Buffer");

/**
 * @constructor
 */
node.tty_posix.WriteStream = function() {};

/**
 * @type {node.buffer.Buffer|null}
 */
node.tty_posix.WriteStream.prototype.bufferSize = null;

/**
 * @type {string|null}
 */
node.tty_posix.WriteStream.prototype.fd = null;

/**
 * @type {string|null}
 */
node.tty_posix.WriteStream.prototype.type = null;

/**
 * @type {string|null}
 */
node.tty_posix.WriteStream.prototype.allowHalfOpen = null;

/**
 * @type {boolean|null}
 */
node.tty_posix.WriteStream.prototype.isTTY = null;

/**
 * @param {string} x
 * @param {string} y
 */
node.tty_posix.WriteStream.prototype.cursorTo = function(x, y) {
  return node.tty_posix.WriteStream.core_.cursorTo.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} dx
 * @param {string} dy
 */
node.tty_posix.WriteStream.prototype.moveCursor = function(dx, dy) {
  return node.tty_posix.WriteStream.core_.moveCursor.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} dir
 */
node.tty_posix.WriteStream.prototype.clearLine = function(dir) {
  return node.tty_posix.WriteStream.core_.clearLine.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} fd
 * @param {string} type
 */
node.tty_posix.WriteStream.prototype.open = function(fd, type) {
  return node.tty_posix.WriteStream.core_.open.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} data
 * @param {string} [fd]
 * @param {string} [cb]
 */
node.tty_posix.WriteStream.prototype.write = function(data, [fd], [cb]) {
  return node.tty_posix.WriteStream.core_.write.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.WriteStream.prototype.flush = function() {
  return node.tty_posix.WriteStream.core_.flush.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string=} encoding
 */
node.tty_posix.WriteStream.prototype.setEncoding = function(encoding) {
  return node.tty_posix.WriteStream.core_.setEncoding.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.WriteStream.prototype.connect = function() {
  return node.tty_posix.WriteStream.core_.connect.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.WriteStream.prototype.address = function() {
  return node.tty_posix.WriteStream.core_.address.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} v
 */
node.tty_posix.WriteStream.prototype.setNoDelay = function(v) {
  return node.tty_posix.WriteStream.core_.setNoDelay.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} enable
 * @param {string} time
 */
node.tty_posix.WriteStream.prototype.setKeepAlive = function(enable, time) {
  return node.tty_posix.WriteStream.core_.setKeepAlive.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} msecs
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.tty_posix.WriteStream.prototype.setTimeout = function(msecs, callback) {
  return node.tty_posix.WriteStream.core_.setTimeout.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.WriteStream.prototype.pause = function() {
  return node.tty_posix.WriteStream.core_.pause.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.WriteStream.prototype.resume = function() {
  return node.tty_posix.WriteStream.core_.resume.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 *
 */
node.tty_posix.WriteStream.prototype.destroySoon = function() {
  return node.tty_posix.WriteStream.core_.destroySoon.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} exception
 */
node.tty_posix.WriteStream.prototype.destroy = function(exception) {
  return node.tty_posix.WriteStream.core_.destroy.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} data
 * @param {string=} encoding
 */
node.tty_posix.WriteStream.prototype.end = function(data, encoding) {
  return node.tty_posix.WriteStream.core_.end.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} dest
 * @param {Object} options
 */
node.tty_posix.WriteStream.prototype.pipe = function(dest, options) {
  return node.tty_posix.WriteStream.core_.pipe.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} n
 */
node.tty_posix.WriteStream.prototype.setMaxListeners = function(n) {
  return node.tty_posix.WriteStream.core_.setMaxListeners.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_posix.WriteStream.prototype.emit = function(type) {
  return node.tty_posix.WriteStream.core_.emit.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.WriteStream.prototype.addListener = function(type, listener) {
  return node.tty_posix.WriteStream.core_.addListener.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.WriteStream.prototype.on = function(type, listener) {
  return node.tty_posix.WriteStream.core_.on.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.WriteStream.prototype.once = function(type, listener) {
  return node.tty_posix.WriteStream.core_.once.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_posix.WriteStream.prototype.removeListener = function(type, listener) {
  return node.tty_posix.WriteStream.core_.removeListener.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_posix.WriteStream.prototype.removeAllListeners = function(type) {
  return node.tty_posix.WriteStream.core_.removeAllListeners.apply(node.tty_posix.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_posix.WriteStream.prototype.listeners = function(type) {
  return node.tty_posix.WriteStream.core_.listeners.apply(node.tty_posix.WriteStream.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.tty_posix.WriteStream.core_ = require("tty_posix").WriteStream;