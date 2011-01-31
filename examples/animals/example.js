#!node

/**
 * @fileoverview  This example will try to showcase some of the great features
 *  of the closure compiler.  Such things as:
 * <ul>
 *  <li>Encapsulisation</li>
 *  <li>Interfaces</li>
 *  <li>Type Safety</li>
 *  <li>Code Optimisation</li>
 *  <li>Compile Time Checkings</li>
 *  <li>Code Documentaion</li>
 *  <li>
 *    Provides a Scalable Framework for Enterprise JavaScript Development.
 *  </li>
 * </ul>
 */

/*
 * Does not require an opts parameter as we are providing all the options in
 * the closure.json file in this directory;
 */
require('goog').goog.init();

/*
 * Now that the nodegoog is initialised you can use any base.js functionality
 * such as goog.require / goog.provide
 *
 * Note: At least one namespace must be provided for compilation purposes
 */

goog.provide('node.goog.examples.animals.Example');

goog.require('goog.array');
goog.require('node.goog.examples.animals.Cat');
goog.require('node.goog.examples.animals.Dog');
goog.require('node.goog.examples.animals.IAnimal');
goog.require('node.goog.examples.animals.Monkey');
goog.require('node.goog.examples.animals.Tiger');



/**
 * @constructor
 */
node.goog.examples.animals.Example = function() {
  /**
   * @private
   * @type {Array.<node.goog.examples.animals.IAnimal>}
   */
  this.animals_ = this.initRandomAnimals_();
  this.makeAnimalsTalk_();
};


/**
 * @private
 * @return {Array.<node.goog.examples.animals.IAnimal>} A colleciton of
 *    random animals.
 */
node.goog.examples.animals.Example.prototype.initRandomAnimals_ = function() {
  /** @type {Array.<node.goog.examples.animals.IAnimal>} */
  var animals = [];
  var types = [
    node.goog.examples.animals.Dog,
    node.goog.examples.animals.Cat,
    node.goog.examples.animals.Tiger,
    node.goog.examples.animals.Monkey
  ];
  var len = parseInt(10 + (Math.random() * 10), 10);
  console.log('Creating ' + len + ' random animals');
  for (var i = 0; i < len; i++) {
    var t = types[parseInt(Math.random() * types.length, 10)];
    animals.push(new t());
  }
  return animals;
};


/**
 * @private
 */
node.goog.examples.animals.Example.prototype.makeAnimalsTalk_ = function() {
  /** @type {Array.<node.goog.examples.animals.IAnimal>} */
  goog.array.forEach(this.animals_, this.makeAnimalTalk_, this);

};


/**
 * @private
 * @param {node.goog.examples.animals.IAnimal} animal The animal to talkify.
 */
node.goog.examples.animals.Example.prototype.makeAnimalTalk_ =
    function(animal) {
  animal.talk();
};


/*
 * Start the demo
 */
new node.goog.examples.animals.Example();
