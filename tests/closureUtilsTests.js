#!/usr/local/bin/node

require('goog').goog.init();

goog.require('goog.testing.jsunit');
goog.require('node.goog.utils');

testReadSettingObjectFromFile = function() {
};

testReadSettingObjectFromDir = function() {
};

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