#!/usr/bin/env node

require('../../../lib/nclosure').nclosure();

goog.require('goog.testing.jsunit');
goog.require('nclosure.examples.simple.Example');

goog.provide('nclosure.examples.simple.tests.syncTests');

testFunction1 = function() {
  assertNotEquals(typeof(example_), 'undefined');
};
