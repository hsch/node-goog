#!/usr/local/bin/node

/*
 * Copyright 2011 Guido Tapia (guido@tapia.com.au).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This is a utility for running all test in a specified
 * directory.
 *
 * @author guido@tapia.com.au (Guido Tapia)
 */


/**
 * @private
 * @type {*}
 */
var ng_ = require('goog').goog.init();
// var ng_ = require('goog').goog.init({additionalDeps:['../tests/deps.js']});

goog.provide('node.goog.googtest');


/**
 * goog/testing/testcase.js Reads this property as soon as it's 'required' so
 * set it now before the goog.requires below
 * @type {{userAgent:string}}
 */
global.navigator = { userAgent: 'node.js' };

goog.require('goog.array');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.TestRunner');
goog.require('goog.testing.jsunit');

goog.require('node.goog.utils');

// TODO: This does not work as node.goog.tests uses node.require.
// The require, deps mechanism in goog.js is a mess.  bin/utils.js is also
// a mess
// goog.require('node.goog.tests');



/**
 * The node.goog.googtest class runs all tests (files case insensitive
 * named *test*) in a directory.
 *
 * @constructor
 */
node.goog.googtest = function() {
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
   * All test files found in the specified directory.
   *
   * @private
   * @type {Array.<string>}
   */
  this.tests_ = this.getAllTestsInCurrentDirectory_();

  /**
   * These are the messages from the child nodeTestRunner that are the results
   * of the tests, it ignores everything before results to allow the tests to
   * do their own console logging.
   * @private
   * @type {Array.<string>}
   */
  this.results_ = [];

  this.runNextTest_();
};


/**
 * @private
 * @return {Array.<string>} All tests files in this directory (recursive).
 */
node.goog.googtest.prototype.getAllTestsInCurrentDirectory_ = function() {
  var dirOrFile = process.argv[2];
  if (!this.fs_.statSync(dirOrFile).isDirectory()) { return [dirOrFile]; }

  return this.readDirRecursiveSyncImpl_(dirOrFile, []);
};


/**
 * @private
 */
node.goog.googtest.prototype.readDirRecursiveSyncImpl_ = function(dir, allFiles) {
  var files = this.fs_.readdirSync(dir);
  goog.array.forEach(files, function(f) {
    var path = node.goog.utils.getPath(dir, f);
    if (this.fs_.statSync(path).isDirectory()) {
      return node.goog.tests.readDirRecursiveSyncImpl_(path, allFiles);
    } else if (f.toLowerCase().indexOf('test') >= 0) {
      allFiles.push(path);
    }
  }, this);
  return allFiles;
};


/**
 * Runs the next test ibn the tests queue.
 * @param {number} errcode The error code returned by nodeTestsRunner below.
 * @private
 */
node.goog.googtest.prototype.runNextTest_ = function(errcode) {
  if (errcode) { console.error('nodeTestsRunner returned errorcode: ' +
      errcode + ' on last invocation.'); }
  if (this.tests_.length === 0) { this.displayFinalResults_(); return; }
  var file = this.tests_.pop();
  this.runTest_(file);
};


/**
 * @private
 * @param {string} testFile The test file to run.
 */
node.goog.googtest.prototype.runTest_ = function(testFile) {
  console.error('\nRunning Test: ' + testFile);
  var test = require('child_process').
      spawn('nodeTestRunner', [testFile]);

  var inResults = false;
  var that = this;
  var printMsg = function(data) {
    var lines = data.toString().split('\n');
    goog.array.forEach(lines, function(l) {
      if (l.charAt(l.length - 1) === '\n') { l = l.substring(0, l.length - 1); }

      if (!inResults &&
          (l.indexOf('[PASSED]') >= 0 || l.indexOf('[FAILED]') >= 0)) {
        inResults = true;
      }

      if (inResults) { that.results_.push(l); }
      else { console.error(l); }
      if (inResults && l.indexOf(' files loaded.') >= 0) { inResults = false; }
    });
  };
  test.stdout.on('data', printMsg);
  test.stderr.on('data', printMsg);

  test.on('uncaughtException', function(err) {
    console.error(err.stack);
  });
  test.on('exit', goog.bind(this.runNextTest_, this));
};


/**
 * @private
 */
node.goog.googtest.prototype.displayFinalResults_ = function() {
  console.log('RESULTS\n=======');
  console.log(this.results_.join('\n'));
};

new node.goog.googtest();

