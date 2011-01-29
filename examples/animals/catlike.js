goog.provide('node.goog.examples.animals.CatLike');

goog.require('node.goog.examples.animals.IAnimal');

/**
 * @constructor
 * @implements {node.goog.examples.animals.IAnimal}
 */
node.goog.examples.animals.CatLike = function() {};

 /** 
  * This is a default implementaion of talk for cat like animals, special cats
  * may want to override this.
  *
  * @inheritDoc 
  */
node.goog.examples.animals.CatLike.prototype.talk = function() {
  console.log('MEEEAWWW');
};