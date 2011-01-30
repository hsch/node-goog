goog.provide('node.goog.examples.animals.Monkey');

goog.require('node.goog.examples.animals.IAnimal');



/**
 * @constructor
 * @implements {node.goog.examples.animals.IAnimal}
 */
node.goog.examples.animals.Monkey = function() {};


/** @inheritDoc */
node.goog.examples.animals.Monkey.prototype.talk = function() {
  console.log('MONKEY MONKEY MONKEY');
};
