#!/usr/local/bin/node

require('goog').goog.init();

var fs_ = require('fs');
var path_ = require('path');

goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.array');
goog.require('node.goog.utils');

var testDir = getDirectory();

tearDownPage = clearTDir;
setUp = clearTDir

function clearTDir() {
  if (!path_.existsSync(testDir)) return
  fs.rmdirSync(testDir);
};


testSimpleDocs = function() {
  console.log ('\n\n\n\ntestSimpleDocs:@!#!@#@!# WITH VAR ');

  writeOutFile('simpletest.js', [
    '/** @fileoverview This is the fileoverview */',
    '\n/** @constructor\nThis is the constructor */'
  ]);
  runDoc('simpletest.js', function(stdout, stderr) {
    console.log('finnished');
  });
};

function writeOutFile(file, contents) {
  var path = node.goog.utils.getPath(testDir, file)
  fs_.writeFileSync(path, contents.join('\n'));
};

function runDoc(file, callback) {
  var path = node.goog.utils.getPath(testDir, file)
  require('child_process').exec('googdoc ' + path,
      function(err, stdout, stderr) {
    stdout = stdout.replace(/\.tmp\.js/g, '.js');
    stderr = stderr.replace(/\.tmp\.js/g, '.js');
    assertNull(err);
    callback(stdout, stderr);
    asyncTestCase.continueTesting();
  });
};

function getDirectory() {
  var file = process.argv[2];
  var d = node.goog.utils.getPath(file.substring(0, file.lastIndexOf('/')),
      '../_docTests');;
  if (!path_.existsSync(d)) { fs_.mkdirSync(d, 0777); }
  return d;
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
