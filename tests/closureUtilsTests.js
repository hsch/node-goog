#!/usr/local/bin/node

var ng_ = require('goog').goog.init();
var utils_ = ng_.getUtils();

goog.require('goog.testing.jsunit');

testReadSettingObjectFromFile = function() {
};

testReadSettingObjectFromDir = function() {
};

testGetPath = function() {
  assertEquals('/dir/file.ext', utils_.getPath('/dir', 'file.ext'));
  assertEquals('/dir/file.ext', utils_.getPath('/dir/', 'file.ext'));
  assertEquals('/dir/file.ext', utils_.getPath('/dir/', '/file.ext'));
  assertEquals('dir1/dir2/file.ext', utils_.getPath('dir1/dir2', '/file.ext'));
};

testExtendObject = function() {
  var o1 = {prop1:1}
  assertEquals(2, utils_.extendObject_(o1, {prop1:2}).prop1);
  utils_.extendObject_(o1, {prop2:3});
  assertEquals(2, o1.prop1);
  assertEquals(3, o1.prop2);
  utils_.extendObject_(o1, {});
  assertEquals(2, o1.prop1);
  assertEquals(3, o1.prop2);
};

