/**
 * @name node.global
 * @namespace
 * These object are available in the global scope and can be accessed from anywhere.
 */

goog.provide("node.global");

/**
 * @type {string|null}
 */
node.global.global = null;

/**
 * @type {string|null}
 */
node.global.process = null;

/**
 * @type {string|null}
 */
node.global.GLOBAL = null;

/**
 * @type {string|null}
 */
node.global.root = null;

/**
 * @type {string|null}
 */
node.global.console = null;

/**
 * @type {string|null}
 */
node.global.nclosure = null;

/**
 * @type {string|null}
 */
node.global.COMPILED = null;

/**
 * @type {string|null}
 */
node.global.goog = null;

/**
 * @type {string|null}
 */
node.global.top = null;

/**
 * @type {string|null}
 */
node.global.window = null;

/**
 *
 */
node.global.DTRACE_NET_SERVER_CONNECTION = function() {
  return node.global.core_.DTRACE_NET_SERVER_CONNECTION.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.DTRACE_NET_STREAM_END = function() {
  return node.global.core_.DTRACE_NET_STREAM_END.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.DTRACE_HTTP_SERVER_REQUEST = function() {
  return node.global.core_.DTRACE_HTTP_SERVER_REQUEST.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.DTRACE_HTTP_SERVER_RESPONSE = function() {
  return node.global.core_.DTRACE_HTTP_SERVER_RESPONSE.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.setTimeout = function() {
  return node.global.core_.setTimeout.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.setInterval = function() {
  return node.global.core_.setInterval.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.clearTimeout = function() {
  return node.global.core_.clearTimeout.apply(node.global.core_, arguments);
};

/**
 *
 */
node.global.clearInterval = function() {
  return node.global.core_.clearInterval.apply(node.global.core_, arguments);
};

/**
 * @param {string} path
 */
node.global.require = function(path) {
  return node.global.core_.require.apply(node.global.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.global.core_ = global;