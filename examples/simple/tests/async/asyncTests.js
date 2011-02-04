#!/usr/local/bin/node

require('goog').goog.init();

goog.require('goog.testing.AsyncTestCase');
goog.require('goog.testing.jsunit');
goog.require('node.goog.examples.simple.Example');

goog.provide('node.goog.examples.simple.tests.asyncTests');

testFunction1 = function() {
  asyncTestCase.waitForAsync();
  setTimeout(function() {
    assertNotEquals(typeof(example_), 'undefined');
    assertTrue(example_.completed);
    asyncTestCase.continueTesting();
  }, 500);
};

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
