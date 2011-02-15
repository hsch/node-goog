#!/usr/local/bin/node

/**
 * @fileoverview This is a utility for running all test in a specified
 * directory.
 *
 * @author guido@tapia.com.au (Guido Tapia)
 */


/**
 * @private
 * @const
 * @type {nclosure}
 */
var ng_ = require('nclosure').nclosure();

goog.provide('nclosure.nctest');


goog.require('goog.array');

goog.require('nclosure');
goog.require('nclosure.NodeTestsRunner');



/**
 * The nclosure.nctest class runs all tests (files case insensitive
 * named *test*) in a directory.
 *
 * @constructor
 */
nclosure.nctest = function() {
  /**
   * @private
   * @type {extern_fs}
   */
  this.fs_ = /** @type {extern_fs} */ (require('fs'));

  /**
   * @private
   * @type {extern_path}
   */
  this.path_ = /** @type {extern_path} */ (require('path'));

  /**
   * @private
   * @type {nclosure.NodeTestsRunner}
   */
  this.tr_ = new nclosure.NodeTestsRunner(
      this.getAllTestFiles_(), this.getTestArgs_());

  process.on('uncaughtException', goog.bind(this.onException_, this));

  this.tr_.execute();
};


/**
 * @private
 * @return {Array.<string>} All tests files in this directory (recursive).
 */
nclosure.nctest.prototype.getAllTestFiles_ = function() {
  var dirOrFile = process.argv[2];
  if (!this.fs_.statSync(dirOrFile).isDirectory()) { return [dirOrFile]; }

  return this.readDirRecursiveSyncImpl_(dirOrFile, []);
};


/**
 * @private
 * @return {string} The arguments we will pass to all tests to filter
 *    test results.
 */
nclosure.nctest.prototype.getTestArgs_ = function() {
  return process.argv.length > 2 ? process.argv.slice(3).join(',') : '';
};


/**
 * @param {string} dir The directory to read recursively.
 * @param {Array.<string>} allFiles The array containing all the files read.
 * @return {Array.<string>} The allFiles array for fluency.
 * @private
 */
nclosure.nctest.prototype.readDirRecursiveSyncImpl_ =
    function(dir, allFiles) {
  var files = this.fs_.readdirSync(dir);
  goog.array.forEach(files, function(f) {
    var path = ng_.getPath(dir, f);
    if (this.fs_.statSync(path).isDirectory()) {
      return this.readDirRecursiveSyncImpl_(path, allFiles);
    } else if (f.toLowerCase().indexOf('test') >= 0) {
      allFiles.push(path);
    }
  }, this);
  return allFiles;
};


/**
 * @private
 * @param {Error} err The exception thrown by tests.
 */
nclosure.nctest.prototype.onException_ = function(err) {
  if (!err) return;

  if (err.stack) console.error(err.stack);
  else if (err.message) console.error(err.message);
  else if (typeof(err) === 'string') console.error(err);
};

new nclosure.nctest();
