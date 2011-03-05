
goog.provide("node.http.Client");

goog.require("node.buffer.Buffer");

/**
 * @constructor
 */
node.http.Client = function() {};

/**
 * @type {node.buffer.Buffer|null}
 */
node.http.Client.prototype.bufferSize = null;

/**
 * @type {string|null}
 */
node.http.Client.prototype.fd = null;

/**
 * @type {string|null}
 */
node.http.Client.prototype.type = null;

/**
 * @type {string|null}
 */
node.http.Client.prototype.allowHalfOpen = null;

/**
 *
 */
node.http.Client.prototype.ondrain = function() {
  return node.http.Client.core_.ondrain.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} method
 * @param {string} url
 * @param {string} headers
 */
node.http.Client.prototype.request = function(method, url, headers) {
  return node.http.Client.core_.request.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} fd
 * @param {string} type
 */
node.http.Client.prototype.open = function(fd, type) {
  return node.http.Client.core_.open.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} data
 * @param {string} [fd]
 * @param {string} [cb]
 */
node.http.Client.prototype.write = function(data, [fd], [cb]) {
  return node.http.Client.core_.write.apply(node.http.Client.core_, arguments);
};

/**
 *
 */
node.http.Client.prototype.flush = function() {
  return node.http.Client.core_.flush.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string=} encoding
 */
node.http.Client.prototype.setEncoding = function(encoding) {
  return node.http.Client.core_.setEncoding.apply(node.http.Client.core_, arguments);
};

/**
 *
 */
node.http.Client.prototype.connect = function() {
  return node.http.Client.core_.connect.apply(node.http.Client.core_, arguments);
};

/**
 *
 */
node.http.Client.prototype.address = function() {
  return node.http.Client.core_.address.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} v
 */
node.http.Client.prototype.setNoDelay = function(v) {
  return node.http.Client.core_.setNoDelay.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} enable
 * @param {string} time
 */
node.http.Client.prototype.setKeepAlive = function(enable, time) {
  return node.http.Client.core_.setKeepAlive.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} msecs
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.http.Client.prototype.setTimeout = function(msecs, callback) {
  return node.http.Client.core_.setTimeout.apply(node.http.Client.core_, arguments);
};

/**
 *
 */
node.http.Client.prototype.pause = function() {
  return node.http.Client.core_.pause.apply(node.http.Client.core_, arguments);
};

/**
 *
 */
node.http.Client.prototype.resume = function() {
  return node.http.Client.core_.resume.apply(node.http.Client.core_, arguments);
};

/**
 *
 */
node.http.Client.prototype.destroySoon = function() {
  return node.http.Client.core_.destroySoon.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} exception
 */
node.http.Client.prototype.destroy = function(exception) {
  return node.http.Client.core_.destroy.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} data
 * @param {string=} encoding
 */
node.http.Client.prototype.end = function(data, encoding) {
  return node.http.Client.core_.end.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} dest
 * @param {Object} options
 */
node.http.Client.prototype.pipe = function(dest, options) {
  return node.http.Client.core_.pipe.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} n
 */
node.http.Client.prototype.setMaxListeners = function(n) {
  return node.http.Client.core_.setMaxListeners.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} type
 */
node.http.Client.prototype.emit = function(type) {
  return node.http.Client.core_.emit.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.http.Client.prototype.addListener = function(type, listener) {
  return node.http.Client.core_.addListener.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.http.Client.prototype.on = function(type, listener) {
  return node.http.Client.core_.on.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.http.Client.prototype.once = function(type, listener) {
  return node.http.Client.core_.once.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.http.Client.prototype.removeListener = function(type, listener) {
  return node.http.Client.core_.removeListener.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} type
 */
node.http.Client.prototype.removeAllListeners = function(type) {
  return node.http.Client.core_.removeAllListeners.apply(node.http.Client.core_, arguments);
};

/**
 * @param {string} type
 */
node.http.Client.prototype.listeners = function(type) {
  return node.http.Client.core_.listeners.apply(node.http.Client.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.http.Client.core_ = require("http").Client;