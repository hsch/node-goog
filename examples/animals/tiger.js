goog.provide('node.goog.examples.animals.Tiger');

goog.require('node.goog.examples.animals.IAnimal');
goog.require('node.goog.examples.animals.CatLike');

/**
 * @constructor
 * @extends {node.goog.examples.animals.CatLike}
 */
node.goog.examples.animals.Tiger = function() {
  node.goog.examples.animals.CatLike.call(this);
};
goog.inherits(node.goog.examples.animals.Tiger, 
  node.goog.examples.animals.CatLike);
  
/** 
 * @override 
 * Don't use te default implementation of CatLike.talk as tigers are very 
 *    special and deserve respect.
 */
node.goog.examples.animals.Tiger.prototype.talk = function() {
  console.log('SCARY TIGGGGER NOISE!!!');
};