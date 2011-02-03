#!/usr/local/bin/node

require('goog').goog.init();

var fs_ = require('fs');
var path_ = require('path');

goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.array');

var baseDir = '../';
var testsDir = ['examples/simple/tests/'];

var testFiles = getAllTestFiles();

setUp = function() {
  asyncTestCase.stepTimeout = 10000;
};

function getAllTestFiles() {
  var testFiles = [];
  goog.array.forEach(testsDir, function(d) {
    readFilesInDir(__dirname + '/' + baseDir + d, testFiles);
  });
  return testFiles;
}

function readFilesInDir(d, list) {
  var files = fs_.readdirSync(d);
  goog.array.forEach(files, function(f) {
    if (fs_.statSync(d + f).isDirectory()) {
      return readFilesInDir(d + f + '/', list);
    } else if (f.toLowerCase().indexOf('test') >= 0 && f.indexOf('.js') > 0) {
      list.push(d + f);
    }
  });
  return list;
};

testPassingTests = function() {
  console.log('testPassingTests:\n\t' + testFiles.join('\n\t'));
  runNextTest();
};

function runNextTest() {
    if (testFiles.length === 0) { return console.log('All tests finnished.'); }
    var test = testFiles.pop();
    runTestImpl(test, function() {
      runNextTest();
    });
};

function runTestImpl(file, callback) {
  console.log('running test ' + file);
  asyncTestCase.waitForAsync();
  require('child_process').exec(file,
      function(err, stdout, stderr) {
    stdout = stdout.replace(/\.tmp\.js/g, '.js');
    stderr = stderr.replace(/\.tmp\.js/g, '.js');
    var shortFile = file.substring(file.lastIndexOf('/') + 1);
    assertNull('There were errors trying to run test: ' + shortFile, err);

    assertTrue('Some tests in file[' + shortFile + '] failed.',
      stdout.indexOf(', 0 failed') > 0);
    asyncTestCase.continueTesting();
    callback();
  });
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();