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


goog.provide('node.goog.googtest');

goog.require('goog.array');

goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.jsunit');
goog.require('node.goog.utils');

goog.testing.jsunit['AUTO_RUN_ONLOAD'] = false;



/**
 * The node.goog.googtest class runs all tests (files case insensitive
 * named *test*) in a directory.
 *
 * @constructor
 */
node.goog.googtest = function() {
  global.__filename = __filename;
  global.__dirname = __dirname;

  var dir = process.argv[2];
  if (!dir) {
    throw new Error('No directory specified.  USAGE: googtest <dirname>');
  }
  ng_.loadDependenciesFile(dir, 'deps.js');
  ng_.loadAdditionalSettingsFile(dir);
  ng_.setOnTestComplete(this.createTestCompletedHandler_());
  goog.testing.TestCase.prototype.isInsideMultiTestRunner = function() {
    return true;
  }

  /**
   * @private
   * @type {extern_fs}
   */
  this.fs_ = /** @type {extern_fs} */ (require('fs'));

  /**
   * All test files found in the specified directory.
   *
   * @private
   * @type {Array.<string>}
   */
  this.tests_ = this.getAllTestsInCurrentDirectory_();
  /**
   * All the results, populated as tests complete.
   *
   * @private
   * @type {Array.<goog.testing.TestCase>}
   */
  this.results_ = [];

  var that = this;
  ng_.onTestsReady = function() {
    that.runNextTest_();
  };
};


/**
 * Runs the next test ibn the tests queue.
 *
 * @private
 */
node.goog.googtest.prototype.runNextTest_ = function() {
  if (this.tests_.length === 0) {
    this.displayResults_();
  } else {
    var file = this.tests_.pop();
    this.runTest_(file);
  }
};


/**
 * Prints the results from each test case to the console.
 *
 * @private
 */
node.goog.googtest.prototype.displayResults_ = function() {
  console.log('\nRESULTS\n=======');
  goog.array.forEach(this.results_, function(tc) {
    console.log(tc.getReport(false));
  });
};


/**
 * @private
 * @return {Array.<string>} All tests files in this directory (recursive).
 */
node.goog.googtest.prototype.getAllTestsInCurrentDirectory_ = function() {
  var dirOrFile = process.argv[2];
  if (!this.fs_.statSync(dirOrFile).isDirectory()) { return [dirOrFile]; }

  return this.getTestFilesImpl_([], dirOrFile);
};


/**
 * @private
 * @param {Array.<string>} testFiles The array to hold all test files.
 * @param {string} dir The directory to check for test files.
 * @return {Array.<string>} All tests files in this directory.
 */
node.goog.googtest.prototype.getTestFilesImpl_ = function(testFiles, dir) {
  goog.array.forEach(this.fs_.readdirSync(dir), function(f) {
    var path = node.goog.utils.getPath(dir, f);
    if (this.fs_.statSync(path).isDirectory()) {
      return this.getTestFilesImpl_(testFiles, path);
    } else if (f.toLowerCase().indexOf('test') >= 0) {
      testFiles.push(path);
    }
  }, this);
  return testFiles;
};


/**
 * @type {function():goog.testing.AsyncTestCase}
 */
node.goog.googtest.originalCreateAndInstall =
    goog.testing.AsyncTestCase.createAndInstall;


/**
 * @private
 * @type {goog.testing.AsyncTestCase}
 */
node.goog.googtest.asyncTest_;


/**
 * @override
 */
goog.testing.AsyncTestCase.createAndInstall = function() {
  return node.goog.googtest.asyncTest_ =
      node.goog.googtest.originalCreateAndInstall();
};


/**
 * @private
 * @param {string} testFile The test file to run.
 */
node.goog.googtest.prototype.runTest_ = function(testFile) {
  var shortName = testFile.substring(testFile.lastIndexOf('/') + 1);
  console.log('\nRunning Test: ' + shortName);

  var script = process.binding('evals').Script;
  var code = this.fs_.readFileSync(testFile, 'utf-8').
      replace(/^#![^\n]+/, '');
  var async = code.indexOf('AsyncTestCase') >= 0;

  this.clearGlobalScopeOfTests_();
  script.runInThisContext.call(global, code, shortName);

  var tr = global['G_testRunner'];
  if (!async) {
    var test = new goog.testing.TestCase(shortName);
    test.autoDiscoverTests();
  }
  tr.initialize(async ? node.goog.googtest.asyncTest_ : test);
  tr.execute();
};


/**
 * @private
 */
node.goog.googtest.prototype.clearGlobalScopeOfTests_ = function() {
  for (var i in global) {
    if (i.indexOf('test') === 0 || i.indexOf('setUp') === 0 ||
        i.indexOf('tearDown') === 0) {
      delete global[i];
    }
  }
};


/**
 * @private
 * @return {function():undefined} The on complete handler.
 */
node.goog.googtest.prototype.createTestCompletedHandler_ = function() {
  var that = this;
  /**
   * @this {goog.testing.TestRunner}
   */
  return function() {
    that.results_.push(this.testCase);
    that.runNextTest_();
  };
};

new node.goog.googtest();
