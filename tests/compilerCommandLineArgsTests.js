#!/usr/local/bin/node

/**
 * @fileOverview This test is to try to get the async stuff working better.
 * Currently we cannot get proper logs of async tests and we cannot use
 * googtest with async tests.
 */
var ng_ = require('goog').goog.init();

goog.provide('node.goog.tests.compilerCommandLineArgsTests');

goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');

goog.require('node.goog.utils');

var fs = require('fs');
var path = require('path');
var deps = node.goog.utils.getPath(__dirname, 'deps.js');
var min = __filename.replace('.js', '.min.js');

setUp = function() {
  clearDepsAndCompiledFile();
};

tearDown = function() {
  clearDepsAndCompiledFile();
};

function clearDepsAndCompiledFile() {
  if (path.existsSync(deps)) { fs.unlinkSync(deps); }
  if (path.existsSync(min)) { fs.unlinkSync(min); }
};

testCompileWithNoArgs = function() {
  runImpl('googcompile ' + __filename, true, true);
};

testCompileWithNoDepsArg = function() {
  runImpl('googcompile -n ' + __filename, true, false);
};

testCompileWithQuietArg = function() {
  runImpl('googcompile -q ' + __filename, false, false);
};

testCompileWithDepsOnlyArg = function() {
  runImpl('googcompile -d ' + __filename, false, false);
};

function runImpl(cmd, compiledMinFile, depsFile) {
  console.log(cmd);

  asyncTestCase.stepTimeout = 10000;
  asyncTestCase.waitForAsync();

  require('child_process').exec(cmd,
      function(err, stdout, stderr) {
    if (err) {
      assertNull('There were errors running: ' +
        cmd + ' message: ' + err.message + '\n' + err.stack, err);
    }
    assertFilesExist(compiledMinFile, depsFile);
  });
};

function assertFilesExist(compiledMinFile, depsFile) {
  assertEquals('Expected the compiled min file [' + min + '] to[' +
    (compiledMinFile ? 'exist' : 'not exist') + ']',
    compiledMinFile, path.existsSync(min));
  assertEquals('Expected the deps file [' + deps + '] to[' +
    (depsFile ? 'exist' : 'not exist') + ']',
    depsFile, path.existsSync(deps));
  asyncTestCase.continueTesting();
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
