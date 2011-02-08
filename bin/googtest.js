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


// goog/testing/testcase.js Reads this property as soon as it's 'required' so
// set it now before the goog.requires below
/**
 * @type {{userAgent:string}}
 */
global.navigator = { userAgent: 'node.js' };

goog.require('goog.array');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.TestRunner');
goog.require('goog.testing.jsunit');

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

  this.init_();
  this.runNextTest_();
};


/**
 * @private
 */
node.goog.googtest.prototype.init_ = function() {
  this.loadAdditionalSettingsAndTestingDeps_();
  this.interceptRequiredPoints_();
};


/**
 * @private
 */
node.goog.googtest.prototype.loadAdditionalSettingsAndTestingDeps_ =
    function() {
  var dir = process.argv[2];
  if (!dir) {
    throw new Error('No directory or file specified.  ' +
        'USAGE: googtest <dirname or filename>');
  }
  global.__filename = global.__filename || __filename;
  global.__dirname = global.__dirname || __dirname;

  ng_.loadDependenciesFile(dir, 'deps.js');
  ng_.loadAdditionalSettingsFile(dir);
};


/**
 * @private
 */
node.goog.googtest.prototype.interceptRequiredPoints_ = function() {
  global.require = require;
  global.document = {
    write: function(str) { },
    getElementById: function(id) { return {}; }
  };
  this.setSpecificTestIfSpecified_();
  this.mockRequiredGoogFrameworkStuff_();
};


/**
 * @private
 */
node.goog.googtest.prototype.setSpecificTestIfSpecified_ = function() {
  var specificTest = process.argv[process.argv.length - 1];
  if (specificTest.search(/[\.\/\\]/g) >= 0) { specificTest = null; }
  if (specificTest && this.path_.existsSync(
      node.goog.utils.getPath(process.cwd(), specificTest))) {
    specificTest = null;
  }

  // This is used by test runner or test case to determine if a specific test
  // is to be run rather than autoDiscovering them
  global.window.location = {
    search: specificTest ? ('?runTests=' + specificTest) : '',
    href: ''
  };
};


/**
 * When we detect testcase.js loaded we add a few hooks and hacks to
 *    ensure thatthe tests work as expected
 * @private
 */
node.goog.googtest.prototype.mockRequiredGoogFrameworkStuff_ = function() {
  var that = this;

  var tc = goog.testing.TestCase.prototype;
  tc['countNumFilesLoaded_'] = function() { return 1; };
  tc.log = function(msg) {};

  goog.testing.stacktrace.parseStackFrame_ = this.parseStackFrameLine_;
  goog.testing.stacktrace.framesToString_ = this.stackFramesToString_;
  goog.testing.TestRunner.prototype['onComplete_'] = function() {
    that.results_.push(this.testCase);
    that.runNextTest_();
  };
/*
  process.on('uncaughtException', function(ex) {
    // Ignore any exception that the async framework threw on purpose
    if (ex.message === 'AsyncTestCase.ControlBreakingException') {
      return;
    }
    if (ex.stack) console.error(ex.stack);
  });
  */
};


/**
 * For each raw text line find an appropriate 'goog.testing.stacktrace.Frame'
 * object which constructs with these args:
 *  {string} context Context object, empty in case of global functions
 *    or if the browser doesn't provide this information.
 *  {string} name Function name, empty in case of anonymous functions.
 *  {string} alias Alias of the function if available. For example the
 *    function name will be 'c' and the alias will be 'b' if the function is
 *    defined as <code>a.b = function c() {};</code>.
 *  {string} args Arguments of the function in parentheses if available.
 *  {string} path File path or URL including line number and optionally
 *   column number separated by colons
 *
 * @private
 * @param {string} line A line in the stack trace.
 * @return {goog.testing.stacktrace.Frame} The parsed frame.
*/
node.goog.googtest.prototype.parseStackFrameLine_ = function(line) {
  if (!line || line.indexOf('    at ') !== 0) {
    return null;
  }

  line = line.substring(line.indexOf(' at ') + 4);
  if (line.charAt(0) === '/') { // Path to test file
    return new goog.testing.stacktrace.Frame('', '', '', '', line);
  }
  var contextAndFunct = line.substring(0, line.lastIndexOf(' ')).split('.');
  var context = '';
  var funct = '';
  if (contextAndFunct.length === 1) {
    funct = contextAndFunct[0];
  } else {
    context = contextAndFunct[0];
    funct = contextAndFunct[1];
  }
  var path = line.substring(line.indexOf('(') + 1);

  return new goog.testing.stacktrace.Frame(context, funct, '', '',
      path.substring(0, path.length - 1));
};


/**
 * Converts the stack frames into canonical format. Chops the beginning and the
 * end of it which come from the testing environment, not from the test itself.
 * @param {!Array.<goog.testing.stacktrace.Frame>} frames The frames.
 * @return {string} Canonical, pretty printed stack trace.
 * @private
 */
node.goog.googtest.prototype.stackFramesToString_ = function(frames) {
  var canonical = [];
  var printing = false;
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i];
    if (!f) continue;
    var str = frames[i].toCanonicalString();
    if (str.indexOf('_assert at testing') === 0) {
      printing = true;
      continue;
    } else if (str.indexOf('[object Object].execute at testing') === 0) {
      break;
    }
    if (!printing) continue;
    canonical.push('> ');
    canonical.push(str);
    canonical.push('\n');
  }
  return canonical.join('');
};


/**
 * @param {string} report The test report to colorize.
 * @return {string} The colorized report.
 */
node.goog.googtest.prototype.colorizeReport = function(report) {
  var lines = report.replace(/\s*$/, '').split('\n');
  // Remove empty lines
  lines = goog.array.filter(lines, function(l) { return l !== ''; });
  var isSuccess = true;
  lines = goog.array.map(lines, function(l) {
    if (l.indexOf('[FAILED]') > 0) {
      isSuccess = false;
    } else if (l.indexOf('[SUCCESS]') > 0) {
      isSuccess = true;
    }
    return (isSuccess ? '\x1B[0;32m' : '\x1B[0;31m') + l;
  });
  var titleLen = lines[0].length - 7; // 7 for the color
  var underline = node.goog.googtest.padString_('', titleLen, '-');
  lines.splice(1, 0, underline);
  return lines.join('\n');
};


/**
 * Gets a string padded with given character to get given size.
 * @param {string} str The given string to be padded.
 * @param {number} length The target size of the string.
 * @param {string} ch The character to be padded with.
 * @return {string} The padded string.
 * @private
 */
node.goog.googtest.padString_ = function(str, length, ch) {
  while (str.length < length) {
    str = ch + str;
  }
  return str;
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

  var reports = goog.array.map(this.results_,
      function(tc) { return tc.getReport(false); });

  // Put the failures at the bottom so u dont have to scroll up
  reports.sort(function(r1, r2) {
    if (r2.indexOf('[FAILED]')) return r1.indexOf('[FAILED]');
    else if (r1.indexOf('[FAILED]')) return r2.indexOf('[FAILED]');
    return 0;
  });

  var first = true;
  goog.array.forEach(reports, function(r) {
    console.log((first ? '' : '\n') + this.colorizeReport(r));
    first = false;
  }, this);
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
  node.goog.googtest.asyncTest_ =
      node.goog.googtest.originalCreateAndInstall();
  return node.goog.googtest.asyncTest_;
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
  } else {
    node.goog.googtest.asyncTest_['name_'] = shortName;
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

new node.goog.googtest();
