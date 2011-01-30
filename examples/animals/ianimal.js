
goog.provide('node.goog.examples.animals.IAnimal');



/**
 * This is the base animal interface that will be inherited by all animals.
 *
 * @interface
 */
node.goog.examples.animals.IAnimal = function() {};


/**
 * Makes the animal talk in its own special way
 */
node.goog.examples.animals.IAnimal.prototype.talk = goog.abstractMethod;
