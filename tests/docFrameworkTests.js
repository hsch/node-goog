#!/usr/local/bin/node

require('goog').goog.init();

var fs_ = require('fs');
var path_ = require('path');

goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');
goog.require('goog.array');
goog.require('node.goog.utils');

var testDir = getDirectory();

var tearDownPage = clearDir;
var setUp = function() {
  var jsdto = node.goog.utils.opts.additionalJSDocToolkitOptions;
  jsdto = goog.array.filter(jsdto, function(o) {
    return o.indexOf('/tests') < 0 && o.indexOf('-d=') < 0;
  });
  jsdto.push('-d=' + node.goog.utils.getPath(testDir, 'docs'));
  console.log('updated opts');
  node.goog.utils.opts.additionalJSDocToolkitOptions = jsdto;
  node.goog.utils.useCachedOpts = true;
};

function clearDir(callback) {
  if (!path_.existsSync(testDir)) {
    if (callback) callback();
    return
  }
  //require('child_process').exec('rm -rf ' + testDir, callback);
  if (callback) callback();
};


function testSimpleDocs() {
  asyncTestCase.waitForAsync();
  clearDir(function() {
    writeOutFile('simplefile.js', [
      '/** @fileoverview This is the fileoverview */',
      '/** @constructor\nThis is the constructor */',
      'var Constt = function() {}',
    ]);
    runDoc(function(stdout, stderr) {
      assertFilesInIndex(['simplefile.js']);
      asyncTestCase.continueTesting();
    });
  });
};

function assertFilesInIndex(files) {
  var indexContents = fs_.readFileSync(
    node.goog.utils.getPath(testDir, 'docs') + '/index.html');
};

function writeOutFile(file, contents) {
  if (!path_.existsSync(testDir)) { fs_.mkdirSync(testDir, 0777); }
  var path = node.goog.utils.getPath(testDir, file)
  fs_.writeFileSync(path, contents.join('\n'), encoding = 'utf8');
};

function runDoc(callback) {
  global._dirToDoc = testDir;
  require('../bin/googdoc');
};

function getDirectory() {
  var file = process.argv[2];
  var d = node.goog.utils.getPath(file.substring(0, file.lastIndexOf('/')),
      '_docTests');;
  return d;
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
asyncTestCase.stepTimeout = 10000;