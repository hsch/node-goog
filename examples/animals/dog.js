goog.provide('node.goog.examples.animals.Dog')

goog.require('node.goog.examples.animals.IAnimal');

/**
 * @constructor
 * @implements {node.goog.examples.animals.IAnimal}
 */
node.goog.examples.animals.Dog = function() {};

/** @inheritDoc */
node.goog.examples.animals.Dog.prototype.talk = function() {
  console.log('WOOOOFF');
};