
goog.provide('demo.fileinfo');

goog.require('goog.debug');



/**
 * @constructor
 * @param {string} path The path that this instance of demo.fileinfo will
 *    operate on.
 */
demo.fileinfo = function(path) {
  this.fs_ = require('fs');
  this.path_ = path;
};


/**
 * @return {string} A descriptive message with all the relevant information on
 *    the specified path.
 */
demo.fileinfo.prototype.getFileInfo = function() {
  var details = this.fs_.statSync(this.path_);
  return goog.debug.expose(details);
};
