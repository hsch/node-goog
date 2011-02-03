# !node;

require('goog').goog.init();

goog.require('goog.testing.jsunit');
goog.require('node.goog.examples.simple.Example');

goog.provide('node.goog.examples.simple.tests.syncTests');

testFunction1 = function() {
  assertNotEquals(typeof(example_), 'undefined');
};
