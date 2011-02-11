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
goog.require('node.goog.NodeTestsRunner');
goog.require('node.goog.utils');


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
   * @private
   * @type {node.goog.NodeTestsRunner}
   */
  this.tr_ = new node.goog.NodeTestsRunner(this.getAllTestFiles_());
  process.on('uncaughtException', goog.bind(this.onException_, this));
  this.tr_.execute();
};



/**
 * @private
 * @return {Array.<string>} All tests files in this directory (recursive).
 */
node.goog.googtest.prototype.getAllTestFiles_ = function() {
  var dirOrFile = process.argv[2];
  if (!this.fs_.statSync(dirOrFile).isDirectory()) { return [dirOrFile]; }

  return this.readDirRecursiveSyncImpl_(dirOrFile, []);
};


/**
 * @private
 */
node.goog.googtest.prototype.readDirRecursiveSyncImpl_ =
    function(dir, allFiles) {
  var files = this.fs_.readdirSync(dir);
  goog.array.forEach(files, function(f) {
    var path = node.goog.utils.getPath(dir, f);
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
 * @param {Error} err The exception thrown by tests
 */
node.goog.googtest.prototype.onException_ = function(err) {
  console.error(err.stack);
};