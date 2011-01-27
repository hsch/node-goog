#!node

/*
 * Load node-goog through Node's standard mechanism, then
 * use Closure's way of importing namespaces.
 */
var nodegoog = require( 'goog' ).goog;

/**
 * Initialise nodegoog. Before initialisation no goog commands can be run.
 * The nodegoog.init method takes in an options object with the following 
 * properties:
 * {
 *    // Location of the closure-library/closure/goog/ directory 
 *    closureBasePath:{string}, 
 *    // Any additional dependency files required to run your code.  These files 
 *    // generally point to other closure libraries.  Note these deps files
 *    // must have paths relative to the same closureBasePath as specified above
 *    additionalDeps:{Array.<string>},
 *    // Path to the compiler jar you want to use.  Default: 'compiler.jar'.
 *    compiler_jar: {string},
 *    // Additional compiler options, e.g: --jscomp_warning=newWarningType
 *    additionalCompileOptions: {Array.<string>},
 *    // These are directories containing source code that needs to be included 
 *    // in the compilation.  If this is not included then additionalDeps is 
 *    // used to try to guess any additional roots required (assumes that the 
 *    // deps.js file is in the root folder of the source directory).
 *    additionalCompileRoots: {Array.<string>}
 * }
 */
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