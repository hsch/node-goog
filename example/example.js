#!node

/**
 * @fileoverview  To get started with node-goog you will need to do the 
 *  following:
 * <ul>
 *  <li>Load node-goog through Node's standard mechanism 
 *    <p>i.e. [var nodegoog = require( 'goog' )].</p>
 *  </li><li>Initialise nodegoog:
 *    <p>i.e. [nodegoog.init(options)]</p>
 *    <p>
 *    <strong>Note: </strong>Before initialisation no goog commands can be run.
 *    </p><p>
 *    The nodegoog.init method takes in an options object with the following 
 *    properties:
 *    </p>
 *    <pre>
 *    {
 *       // Location of the closure-library/closure/goog/ directory 
 *       closureBasePath:{string}, 
 *       // Any additional dependency files required to run your code.  These files 
 *       // generally point to other closure libraries.  Note these deps files
 *       // must have paths relative to the same closureBasePath as specified above
 *       additionalDeps:{Array.<string>},
 *       // Path to the compiler jar you want to use.  Default: 'compiler.jar'.
 *       compiler_jar: {string},
 *       // Additional compiler options, e.g: --jscomp_warning=newWarningType
 *       additionalCompileOptions: {Array.<string>},
 *       // These are directories containing source code that needs to be included 
 *       // in the compilation.  If this is not included then additionalDeps is 
 *       // used to try to guess any additional roots required (assumes that the 
 *       // deps.js file is in the root folder of the source directory).
 *       additionalCompileRoots: {Array.<string>}
 *    }
 *    </pre>
 * </li><li>Use closure library depenencies as required
 *    <p>i.e. [goog.require( 'goog.async.Delay' )]</p>
 * </li></ul>
 */
 
/**
 * @type {NodeGoog} The node-goog object
 */
var nodegoog = require( 'goog' ).goog;

nodegoog.init({
  closureBasePath:
    '../picnet-closure-repo/lib/closure-library/closure/goog/',
  additionalDeps: ['example_external_lib/deps.js']
});

/*
 * Now that the nodegoog is initialised you can use any base.js functionality 
 * such as goog.require / goog.provide
 */

goog.require( 'goog.async.Delay' );
goog.require( 'goog.structs.Trie' );
goog.require( 'node.goog.external.Utils' );

goog.provide('node.goog.Example'); // Required for compilation

/**
 * Example of how to use node-goog project.  The node-goog project allows you 
 * to levarage google's closure compiler and libraries to provide you with a 
 * rich set of tools and type-safety not found in any other JavaScript stack.
 * This example aims to demonstrate how to use the node-goog tool not teach 
 * you the basics of google closure.  For more information on google closure 
 * tools see the Closure Tools project documentation.
 *
 * @see <a href="http://code.google.com/closure/">Closure Tools</a>. 
 * @constructor
 */
node.goog.Example = function() {
  this.createDelay_();
  this.testTrie_();
  this.testExternalLib_();
};

/**
 * Create a delayed function which will be executed in 1.5 seconds.
 *
 * @private
 */
node.goog.Example.prototype.createDelay_ = function() {
  new goog.async.Delay( function() {
    console.info( "Bye!" );
  } ).start( 1500 );
};

/**
 * Create a trie and insert some data. A trie finds the associated data of all 
 * prefixes (of 'examples' in this case) in O(L), where L is the length of 
 * the key:
 *
 * @private
 */
node.goog.Example.prototype.testTrie_ = function() {
  var trie = new goog.structs.Trie();
  trie.add( "demo", "node-goog" );
  trie.add( "ex", [ "girlfriend", "parrot" ] );
  trie.add( "example", { "hello": "world" } );
  
  console.info( trie.getKeyAndPrefixes( "examples" ) );
};

/**
 * Tests link to an external library (using additionalDeps option)
 *
 * @private
 */
node.goog.Example.prototype.testExternalLib_ = function() {
  console.info('Using node.goog.external.Utils.echo("hello world"): ' + node.goog.external.Utils.echo('hello world'));
};

new node.goog.Example();