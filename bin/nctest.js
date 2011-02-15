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
      this.getAllTestFiles_(process.argv[2]), this.getTestArgs_());

  process.on('uncaughtException', goog.bind(this.onException_, this));

  this.tr_.execute();
};


/**
 * @private
 * @param {string} dirOrFile The directory to check for tests files (or
 *    test file).
 * @return {Array.<string>} All tests files in this directory (recursive).
 */
nclosure.nctest.prototype.getAllTestFiles_ = function(dirOrFile) {
  if (!this.fs_.statSync(dirOrFile).isDirectory()) {
    return this.getTestSuiteFiles_(dirOrFile) || [dirOrFile];
  }

  return this.readDirRecursiveSyncImpl_(dirOrFile, []);
};


/**
 * @private
 * @param {string} file The file to check if its a test suite.
 * @return {Array.<string>} If this is a test suite, which is a file that
 *    goog.require('goog.testing.jsunit') and has a suite variable then
 *    return the test suite files relative to this file's directory.
 */
nclosure.nctest.prototype.getTestSuiteFiles_ = function(file) {
  var contents = this.fs_.readFileSync(file).toString();
  var suiteJsRegex = /var\s+suite\s*\=\s*\[([^;]+)\]/gim;

  var m = suiteJsRegex.exec(contents);
  if (!m) { return null; }
  var suittests = goog.array.map(m[1].split(','), function(s) {
    s = goog.string.trim(s);
    return s.substring(1, s.length - 2);
  });
  var dir = ng_.getFileDirectory(file);
  var alltests = [];
  if (!suittests) { return null; }

  var filesOrDirs = goog.array.map(suittests, function(t) {
    var dirOrFile = ng_.getPath(dir, t);
    alltests = goog.array.concat(alltests, this.getAllTestFiles_(dirOrFile));
  }, this);
  return alltests;
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
    } else if (f.toLowerCase().indexOf('suite') >= 0) {
      var suiteFiles = this.getTestSuiteFiles_(path);
      if (suiteFiles) allFiles = goog.array.concat(allFiles, suiteFiles);
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
