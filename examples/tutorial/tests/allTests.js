#!/usr/local/bin/node

// We are now in closure mode
require('nclosure').nclosure();

goog.require('goog.testing.jsunit');
goog.require('demo.fileinfo');

// All tests with the name *test* will automatically be detected.
function testFileInfo() {
  var fi = new demo.fileinfo(__filename);
  assertNotNull(fi.getFileInfo());
};