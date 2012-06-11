
goog.provide("node.vm.Script");

/**
 * @constructor
 */
node.vm.Script = function() {};

/**
 *
 */
node.vm.Script.prototype.createContext = function() {
  return node.vm.Script.core_.createContext.apply(node.vm.Script.core_, arguments);
};

/**
 *
 */
node.vm.Script.prototype.runInContext = function() {
  return node.vm.Script.core_.runInContext.apply(node.vm.Script.core_, arguments);
};

/**
 *
 */
node.vm.Script.prototype.runInThisContext = function() {
  return node.vm.Script.core_.runInThisContext.apply(node.vm.Script.core_, arguments);
};

/**
 *
 */
node.vm.Script.prototype.runInNewContext = function() {
  return node.vm.Script.core_.runInNewContext.apply(node.vm.Script.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.vm.Script.core_ = require("vm").Script;