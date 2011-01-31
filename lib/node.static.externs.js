var common_utils_extern = {};


/**
 * @param {string=} file The file used to try to resolve the args
 *    object from.  This method reads the settings object in the following
 *    order:
 *      - The gloab settings file (closure.json in bin/)
 *      - The source settings file (closure.json in the users source dir)
 *      - The .init call in the fileToCompile file
 * @return {node_goog.opts}
 */
common_utils_extern.readSettingObject = function(file) {};

var node_goog = {};
node_goog.goog = {};
node_goog.goog.init = function(opts) {};


/**
 * @typedef {{closureBasePath:string,
 *    additionalDeps:Array.<string>,
 *    jsdocToolkitDir:string,
 *    nodeDir:string,
 *    compiler_jar:string,
 *    additionalCompileOptions:Array.<string>,
 *    additionalCompileRoots:Array.<string>}}
 */
node_goog.opts;

var exports = {};

////////////////////////////////////////////////////////////////////////////////
// OVERRIDES TO THE node.externs.js FILE
////////////////////////////////////////////////////////////////////////////////

extern_process.prototype.stderr;


/**
 * @type {function(string):*}
 */
var require = function() {};
