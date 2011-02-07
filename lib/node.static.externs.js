/**
 * @fileoverview This is only here because goog.js needs this and it does not
 * support the goog.require syntax as goog is not loaded yet.
 *
 * @externs
 */

/**
 * @constructor
 */
var node_goog_utils;


/**
 * @param {string?} currentDir The directory of the current settings file or
 *    executing javascript file.
 * @param {string?} file The settings (JSON) file to read.
 * @return {Object}
 */
node_goog_utils.prototype.readSettingObject = function(currentDir, file) {};

/**
 * @param {string} dir The base directory of the specified file
 * @param {string} file This is the file (or directory) name which needs to
 *    be concatenated to the baseDir
 * @return {string} The correctly concatenated baseDir + file which should
 *    represent the full path to the specific file/dir
 */
node_goog_utils.prototype.getPath = function(dir, file) {};

/**
 * @param {string?} currentDir The directory of the current settings file or
 *    executing javascript file.
 * @param {string?} file The settings (JSON) file to read.
 * @return {Object} The options object represented in the
 *    specified file.
 */
node_goog_utils.prototype.readArgsFromJSONFile = function(currentDir, file) {};

var node_goog = {};
node_goog.goog = {};
node_goog.goog.init = function(opts) {};

var exports;

////////////////////////////////////////////////////////////////////////////////
// OVERRIDES TO THE node.externs.js FILE
////////////////////////////////////////////////////////////////////////////////

extern_process.prototype.stderr;


/**
 * @type {function(string):*}
 */
var require = function() {};
