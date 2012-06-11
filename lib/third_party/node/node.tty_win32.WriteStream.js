
goog.provide("node.tty_win32.WriteStream");

/**
 * @constructor
 */
node.tty_win32.WriteStream = function() {};

/**
 * @type {string|null}
 */
node.tty_win32.WriteStream.prototype.fd = null;

/**
 * @type {string|null}
 */
node.tty_win32.WriteStream.prototype.writable = null;

/**
 * @type {boolean|null}
 */
node.tty_win32.WriteStream.prototype.isTTY = null;

/**
 * @param {string} data
 * @param {string=} encoding
 */
node.tty_win32.WriteStream.prototype.write = function(data, encoding) {
  return node.tty_win32.WriteStream.core_.write.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} data
 * @param {string=} encoding
 */
node.tty_win32.WriteStream.prototype.end = function(data, encoding) {
  return node.tty_win32.WriteStream.core_.end.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 *
 */
node.tty_win32.WriteStream.prototype.destroy = function() {
  return node.tty_win32.WriteStream.core_.destroy.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} dx
 * @param {string} dy
 */
node.tty_win32.WriteStream.prototype.moveCursor = function(dx, dy) {
  return node.tty_win32.WriteStream.core_.moveCursor.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} x
 * @param {string} y
 */
node.tty_win32.WriteStream.prototype.cursorTo = function(x, y) {
  return node.tty_win32.WriteStream.core_.cursorTo.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} direction
 */
node.tty_win32.WriteStream.prototype.clearLine = function(direction) {
  return node.tty_win32.WriteStream.core_.clearLine.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} dest
 * @param {Object} options
 */
node.tty_win32.WriteStream.prototype.pipe = function(dest, options) {
  return node.tty_win32.WriteStream.core_.pipe.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} n
 */
node.tty_win32.WriteStream.prototype.setMaxListeners = function(n) {
  return node.tty_win32.WriteStream.core_.setMaxListeners.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_win32.WriteStream.prototype.emit = function(type) {
  return node.tty_win32.WriteStream.core_.emit.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_win32.WriteStream.prototype.addListener = function(type, listener) {
  return node.tty_win32.WriteStream.core_.addListener.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_win32.WriteStream.prototype.on = function(type, listener) {
  return node.tty_win32.WriteStream.core_.on.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_win32.WriteStream.prototype.once = function(type, listener) {
  return node.tty_win32.WriteStream.core_.once.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.tty_win32.WriteStream.prototype.removeListener = function(type, listener) {
  return node.tty_win32.WriteStream.core_.removeListener.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_win32.WriteStream.prototype.removeAllListeners = function(type) {
  return node.tty_win32.WriteStream.core_.removeAllListeners.apply(node.tty_win32.WriteStream.core_, arguments);
};

/**
 * @param {string} type
 */
node.tty_win32.WriteStream.prototype.listeners = function(type) {
  return node.tty_win32.WriteStream.core_.listeners.apply(node.tty_win32.WriteStream.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.tty_win32.WriteStream.core_ = require("tty_win32").WriteStream;