#!/usr/local/bin/node

/**
 * @private
 * @type {node.goog}
 * @const
 */
var ng_ = require('goog').goog();

goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.array');

goog.require('node.goog.tests');

var fs_ = require('fs');
var path_ = require('path');

var baseDir = '../';
var testsDirs = ['examples/simple/tests/'];

var testFiles = getAllTestFiles_();

setUpPage = function() { asyncTestCase.stepTimeout = 1000;};

function getAllTestFiles_() {
  var testFiles = [];

  var pattern = /test[\w_\d]+\.js/gi;
  goog.array.forEach(testsDirs, function(d) {
    var files = node.goog.tests.readDirRecursiveSync(
      ng_.getPath(
        ng_.getPath(__dirname, baseDir), d), pattern);
    testFiles = goog.array.concat(testFiles, files);
  });
  return testFiles;
}

function readFilesInDir(d, list) {
  var files = fs_.readdirSync(d);
  goog.array.forEach(files, function(f) {
    var path = ng_.getPath(d, f);
    if (fs_.statSync(path).isDirectory()) {
      return readFilesInDir(path, list);
    } else if (f.toLowerCase().indexOf('test') >= 0 && f.indexOf('.js') > 0) {
      list.push(path);
    }
  });
  return list;
};

function testPassingTests() {
  assertEquals('Did not find all tests', 2, testFiles.length);
  runNextTest();
};

function runNextTest() {
    if (testFiles.length === 0) { return; }
    var test = testFiles.pop();
    runTestImpl(test, function() {
      runNextTest();
    });
};

function runTestImpl(file, callback) {
  asyncTestCase.waitForAsync();
  require('child_process').exec(file,
      function(err, stdout, stderr) {
    if (err) console.error(err.stack);
    if (stderr) console.error(stderr);

    var shortFile = file.substring(file.lastIndexOf('/') + 1);
    assertNull('There were errors trying to run test: ' + shortFile, err);

    assertTrue('Some tests in file[' + shortFile + '] failed.',
      stderr.indexOf(', 0 failed') > 0);
    asyncTestCase.continueTesting();
    callback();
  });
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();