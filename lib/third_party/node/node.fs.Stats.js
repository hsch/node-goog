
goog.provide("node.fs.Stats");

/**
 * Objects returned from <code>fs.stat()</code> and <code>fs.lstat()</code> are of this type.
 *
 *  - <code>stats.isFile()</code>
 *  - <code>stats.isDirectory()</code>
 *  - <code>stats.isBlockDevice()</code>
 *  - <code>stats.isCharacterDevice()</code>
 *  - <code>stats.isSymbolicLink()</code> (only valid with  <code>fs.lstat()</code>)
 *  - <code>stats.isFIFO()</code>
 *  - <code>stats.isSocket()</code>
 * @constructor
 */
node.fs.Stats = function() {};

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.global = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.process = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.GLOBAL = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.root = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.console = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.nclosure = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.COMPILED = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.goog = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.top = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.window = null;

/**
 * @type {string|null}
 */
node.fs.Stats.prototype.module = null;

/**
 *
 */
node.fs.Stats.prototype.setTimeout = function() {
  return node.fs.Stats.core_.setTimeout.apply(node.fs.Stats.core_, arguments);
};

/**
 *
 */
node.fs.Stats.prototype.setInterval = function() {
  return node.fs.Stats.core_.setInterval.apply(node.fs.Stats.core_, arguments);
};

/**
 *
 */
node.fs.Stats.prototype.clearTimeout = function() {
  return node.fs.Stats.core_.clearTimeout.apply(node.fs.Stats.core_, arguments);
};

/**
 *
 */
node.fs.Stats.prototype.clearInterval = function() {
  return node.fs.Stats.core_.clearInterval.apply(node.fs.Stats.core_, arguments);
};

/**
 * @param {string} path
 */
node.fs.Stats.prototype.require = function(path) {
  return node.fs.Stats.core_.require.apply(node.fs.Stats.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.fs.Stats.core_ = require("fs").Stats;