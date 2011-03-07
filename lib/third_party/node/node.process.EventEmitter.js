
goog.provide("node.process.EventEmitter");

/**
 * @constructor
 */
node.process.EventEmitter = function() {};

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.global = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.process = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.GLOBAL = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.root = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.console = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.nclosure = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.COMPILED = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.goog = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.top = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.window = null;

/**
 * @type {string|null}
 */
node.process.EventEmitter.prototype.module = null;

/**
 *
 */
node.process.EventEmitter.prototype.setTimeout = function() {
  return node.process.EventEmitter.core_.setTimeout.apply(node.process.EventEmitter.core_, arguments);
};

/**
 *
 */
node.process.EventEmitter.prototype.setInterval = function() {
  return node.process.EventEmitter.core_.setInterval.apply(node.process.EventEmitter.core_, arguments);
};

/**
 *
 */
node.process.EventEmitter.prototype.clearTimeout = function() {
  return node.process.EventEmitter.core_.clearTimeout.apply(node.process.EventEmitter.core_, arguments);
};

/**
 *
 */
node.process.EventEmitter.prototype.clearInterval = function() {
  return node.process.EventEmitter.core_.clearInterval.apply(node.process.EventEmitter.core_, arguments);
};

/**
 * @param {string} path
 */
node.process.EventEmitter.prototype.require = function(path) {
  return node.process.EventEmitter.core_.require.apply(node.process.EventEmitter.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.process.EventEmitter.core_ = process.EventEmitter;