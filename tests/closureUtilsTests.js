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
};