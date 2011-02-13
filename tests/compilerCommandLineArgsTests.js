#!/usr/local/bin/node

/**
 * @fileOverview This test is to try to get the async stuff working better.
 * Currently we cannot get proper logs of async tests and we cannot use
 * googtest with async tests.
 */

/**
 * @private
 * @type {node.goog}
 * @const
 */
var ng_ = require('goog').goog.init();

goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');

var fs = require('fs');
var path = require('path');
var deps = ng_.getPath(__dirname, 'deps.js');
var min = __filename.replace('.js', '.min.js');

function setUp() { clearDepsAndCompiledFile(); };
function tearDownPage() { clearDepsAndCompiledFile(); };

function clearDepsAndCompiledFile() {
  if (path.existsSync(deps)) { fs.unlinkSync(deps); }
  if (path.existsSync(min)) { fs.unlinkSync(min); }
};

function testCompileWithNoArgs() {
  runCompilerWithCommandImpl('googcompile ' + __filename, true, true);
};

function testCompileWithNoDepsArg() {
  runCompilerWithCommandImpl('googcompile -n ' + __filename, true, false);
};

function testCompileWithQuietArg() {
  runCompilerWithCommandImpl('googcompile -q ' + __filename, false, false);
};

function testCompileWithDepsOnlyArg() {
  runCompilerWithCommandImpl('googcompile -d ' + __filename, false, false);
};

function runCompilerWithCommandImpl(cmd, compiledMinFile, depsFile) {
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
