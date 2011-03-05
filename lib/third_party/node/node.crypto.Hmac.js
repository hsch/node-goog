
goog.provide("node.crypto.Hmac");

/**
 * @constructor
 */
node.crypto.Hmac = function() {};

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.global = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.process = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.GLOBAL = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.root = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.console = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.nclosure = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.COMPILED = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.goog = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.top = null;

/**
 * @type {string|null}
 */
node.crypto.Hmac.prototype.window = null;

/**
 *
 */
node.crypto.Hmac.prototype.DTRACE_NET_SERVER_CONNECTION = function() {
  return node.crypto.Hmac.core_.DTRACE_NET_SERVER_CONNECTION.apply(node.crypto.Hmac.core_, arguments);
};

/**
 *
 */
node.crypto.Hmac.prototype.DTRACE_NET_STREAM_END = function() {
  return node.crypto.Hmac.core_.DTRACE_NET_STREAM_END.apply(node.crypto.Hmac.core_, arguments);
};

/**
 *
 */
node.crypto.Hmac.prototype.DTRACE_HTTP_SERVER_REQUEST = function() {
  return node.crypto.Hmac.core_.DTRACE_HTTP_SERVER_REQUEST.apply(node.crypto.Hmac.core_, arguments);
};

/**
 *
 */
node.crypto.Hmac.prototype.DTRACE_HTTP_SERVER_RESPONSE = function() {
  return node.crypto.Hmac.core_.DTRACE_HTTP_SERVER_RESPONSE.apply(node.crypto.Hmac.core_, arguments);
};

/**
 *
 */
node.crypto.Hmac.prototype.setTimeout = function() {
  return node.crypto.Hmac.core_.setTimeout.apply(node.crypto.Hmac.core_, arguments);
};

/**
 *
 */
node.crypto.Hmac.prototype.setInterval = function() {
  return node.crypto.Hmac.core_.setInterval.apply(node.crypto.Hmac.core_, arguments);
};

/**
 *
 */
node.crypto.Hmac.prototype.clearTimeout = function() {
  return node.crypto.Hmac.core_.clearTimeout.apply(node.crypto.Hmac.core_, arguments);
};

/**
 *
 */
node.crypto.Hmac.prototype.clearInterval = function() {
  return node.crypto.Hmac.core_.clearInterval.apply(node.crypto.Hmac.core_, arguments);
};

/**
 * @param {string} path
 */
node.crypto.Hmac.prototype.require = function(path) {
  return node.crypto.Hmac.core_.require.apply(node.crypto.Hmac.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.crypto.Hmac.core_ = require("crypto").Hmac;