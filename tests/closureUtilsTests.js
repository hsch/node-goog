#!/usr/local/bin/node

var nodeGoog = require('goog').goog;
nodeGoog.init();

goog.require('goog.array');
goog.require('goog.testing.jsunit');
goog.require('node.goog.utils');


testGetPath = function() {
  assertEquals('/dir/file.ext', node.goog.utils.getPath('/dir', 'file.ext'));
  assertEquals('/dir/file.ext', node.goog.utils.getPath('/dir/', 'file.ext'));
  assertEquals('/dir/file.ext', node.goog.utils.getPath('/dir/', '/file.ext'));
  assertEquals('dir1/dir2/file.ext',
    node.goog.utils.getPath('dir1/dir2', '/file.ext'));
};

testExtendObject = function() {
  var o1 = {prop1:1}
  assertEquals(2, node.goog.utils.extendObject_(o1, {prop1:2}).prop1);
  node.goog.utils.extendObject_(o1, {prop2:3});
  assertEquals(2, o1.prop1);
  assertEquals(3, o1.prop2);
  node.goog.utils.extendObject_(o1, {});
  assertEquals(2, o1.prop1);
  assertEquals(3, o1.prop2);

  var o1 = {prop:[1]};
  node.goog.utils.extendObject_(o1, {prop:[2, 3]});
  assertArrayEquals([1, 2, 3], o1.prop);
};

testValidateOpsObject_DirectoriesMadeAbsolute = function() {
  // Mock
  node.goog.utils.checkDirExists_ = function() { return true; }

  var settings = {
    additionalDeps: ['relDir1', '/absolute/dir2'],
    jsdocToolkitDir:'relDir1',
    nodeDir:'relDir1',
    compiler_jar:'relDir1/compiler.jar',
    additionalCompileRoots: ['relDir1', '/absolute/dir2'],
    closureBasePath: 'relDir1'
  };

  node.goog.utils.validateOpsObject_('/root', settings, true);
  assertEquals('additionalDeps', '/root/relDir1', settings.additionalDeps[0]);
  assertEquals('additionalDeps', '/absolute/dir2', settings.additionalDeps[1]);
  assertEquals('jsdocToolkitDir', '/root/relDir1', settings.jsdocToolkitDir);
  assertEquals('nodeDir', '/root/relDir1', settings.nodeDir);
  assertEquals('compiler_jar', '/root/relDir1/compiler.jar', settings.compiler_jar);
  assertEquals('additionalCompileRoots', '/root/relDir1', settings.additionalCompileRoots[0]);
  assertEquals('additionalCompileRoots', '/absolute/dir2', settings.additionalCompileRoots[1]);
  assertEquals('closureBasePath', '/root/relDir1', settings.closureBasePath);
};

testParseClosureBasePath_ = function() {
  var alias = node.goog.utils.parseClosureBasePath_;
  assertEquals('1', '/test1/test2/closure-library', alias('/test1/test2/closure-library/test3/test4'));
  assertEquals('2', 'test1/test2/closure-library', alias('test1/test2/closure-library/test3/test4'));
  assertEquals('3', '/test1/test2/closure-library', alias('\\test1/test2\\closure-library\\test3/test4'));
  assertEquals('4', 'test1/test2/closure-library', alias('test1/test2\\closure-library\\test3/test4'));
};

testParseStackFrame = function() {
  var ls = [
    'Error',
    '    at Object.get (testing/stacktrace.js:463:15)',
    '    at new <anonymous> (testing/asserts.js:930:45)',
    '    at Object.raiseException_ (testing/asserts.js:904:9)',
    '    at _assert (testing/asserts.js:145:26)',
    '    at assertEquals (testing/asserts.js:289:3)',
    '    at /home/ubuntu/Dev/projects/node-goog/tests/closureUtilsTests.js:70:3',
    '    at [object Object].execute (testing/testcase.js:901:12)'
  ];

  validateStackLine(ls[0], null);
  validateStackLine(ls[1], ['Object', 'get', 'testing/stacktrace.js:463:15']);
  validateStackLine(ls[2], ['new <anonymous>', '', '(testing/asserts.js:930:45)']);
  validateStackLine(ls[3], ['Object', 'raiseException_', '(testing/asserts.js:904:9)']);
  validateStackLine(ls[4], ['', '_assert', '(testing/asserts.js:145:26)']);
  validateStackLine(ls[5], ['', 'assertEquals', '(testing/asserts.js:289:3)']);
  validateStackLine(ls[6], ['', '', '/home/ubuntu/Dev/projects/node-goog/tests/closureUtilsTests.js:70:3']);
  validateStackLine(ls[7], ['[object Object]', 'execute', '(testing/testcase.js:901:12)']);
};

function validateStackLine(line, frame) {
  var expVals = nodeGoog.parseStackFrameLine_(line);

  if (!expVals) {
    assertNull('Line: ' + line + ' exptected null frame', frame);
    return;
  }
  assertNotNull('Line: ' + line + ' exptected NOT null frame', frame);

  assertEquals('Line: ' + line + ' context', expVals[0], frame.context_);
  assertEquals('Line: ' + line + ' function name', expVals[1], frame.name_);
  assertEquals('Line: ' + line + ' alias', undefined, frame.alias_);
  assertEquals('Line: ' + line + ' args', undefined, frame.args_);
  assertEquals('Line: ' + line + ' path', expVals[2], frame.path_);
}

te__stFailure = function() {
  assertEquals(true, false);
};