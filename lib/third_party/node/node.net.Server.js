
goog.provide("node.net.Server");

/**
 * @constructor
 */
node.net.Server = function() {};

/**
 * @type {string|null}
 */
node.net.Server.prototype.connections = null;

/**
 * @type {string|null}
 */
node.net.Server.prototype.allowHalfOpen = null;

/**
 * @type {string|null}
 */
node.net.Server.prototype.watcher = null;

/**
 * @param {string} msecs
 */
node.net.Server.prototype.pause = function(msecs) {
  return node.net.Server.core_.pause.apply(node.net.Server.core_, arguments);
};

/**
 *
 */
node.net.Server.prototype.listen = function() {
  return node.net.Server.core_.listen.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} fd
 * @param {string} type
 */
node.net.Server.prototype.listenFD = function(fd, type) {
  return node.net.Server.core_.listenFD.apply(node.net.Server.core_, arguments);
};

/**
 *
 */
node.net.Server.prototype.address = function() {
  return node.net.Server.core_.address.apply(node.net.Server.core_, arguments);
};

/**
 *
 */
node.net.Server.prototype.close = function() {
  return node.net.Server.core_.close.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} n
 */
node.net.Server.prototype.setMaxListeners = function(n) {
  return node.net.Server.core_.setMaxListeners.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Server.prototype.emit = function(type) {
  return node.net.Server.core_.emit.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Server.prototype.addListener = function(type, listener) {
  return node.net.Server.core_.addListener.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Server.prototype.on = function(type, listener) {
  return node.net.Server.core_.on.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Server.prototype.once = function(type, listener) {
  return node.net.Server.core_.once.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} type
 * @param {string} listener
 */
node.net.Server.prototype.removeListener = function(type, listener) {
  return node.net.Server.core_.removeListener.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Server.prototype.removeAllListeners = function(type) {
  return node.net.Server.core_.removeAllListeners.apply(node.net.Server.core_, arguments);
};

/**
 * @param {string} type
 */
node.net.Server.prototype.listeners = function(type) {
  return node.net.Server.core_.listeners.apply(node.net.Server.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.net.Server.core_ = require("net").Server;