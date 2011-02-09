
goog.provide('node.goog.tests');

goog.require('node.goog.utils');
goog.require('goog.array');

node.goog.tests.fs_ = require('fs');
node.goog.tests.path_ = require('path');

/**
 * @param {string} dir The directory to read all files for
 * @param {string|RegExp=} filter An optional regex filter that the full file
 *    name must match
 * @return {Array.<string>} A list of all files in the specified directory
 *    (recursive) that optionally match the specified filter regex.
 */
node.goog.tests.readDirRecursiveSync = function(dir, filter) {
  var files = [];
  node.goog.tests.readDirRecursiveSyncImpl_(dir, files);
  if (filter) {
    filter = typeof(filter) === 'string' ? new RegExp(filter) : filter;
    files = goog.array.filter(files, function(f) {
      return f.match(filter);
    });
  }
  return files;
};

/**
 * @private
 */
node.goog.tests.readDirRecursiveSyncImpl_ = function(dir, allFiles) {
  var files = node.goog.tests.fs_.readdirSync(dir);
  goog.array.forEach(files, function(f) {
    var path = node.goog.utils.getPath(dir, f);
    if (node.goog.tests.fs_.statSync(path).isDirectory()) {
      return node.goog.tests.readDirRecursiveSyncImpl_(path, allFiles);
    } {
      allFiles.push(path);
    }
  });
};