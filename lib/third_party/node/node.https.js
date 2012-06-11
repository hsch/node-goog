/**
 * @name node.https
 * @namespace
 * HTTPS is the HTTP protocol over TLS&#47;SSL. In Node this is implemented as a
 * separate module.
 */

goog.provide("node.https");

/**
 * @param {string} opts
 * @param {string} requestListener
 */
node.https.createServer = function(opts, requestListener) {
  return node.https.core_.createServer.apply(node.https.core_, arguments);
};

/**
 * @param {Object} options
 */
node.https.getAgent = function(options) {
  return node.https.core_.getAgent.apply(node.https.core_, arguments);
};

/**
 * @param {Object} options
 * @param {function(Error?,...[*]):undefined=} cb
 */
node.https.request = function(options, cb) {
  return node.https.core_.request.apply(node.https.core_, arguments);
};

/**
 * @param {Object} options
 * @param {function(Error?,...[*]):undefined=} cb
 */
node.https.get = function(options, cb) {
  return node.https.core_.get.apply(node.https.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.https.core_ = require("https");