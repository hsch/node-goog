/*
 * Load node-goog through Node's standard mechanism, then
 * use Closure's way of importing namespaces.
 */
var nodegoog = require( 'goog' ).goog;

nodegoog.init({
  closureBasePath:
    '/home/gatapia/dev/picnet-closure-repo/lib/closure-library/closure/goog/',
  additionalDeps: ['/home/gatapia/dev/picnet-closure-repo/src/deps.js']
});

goog.require( 'goog.async.Delay' );
goog.require( 'goog.structs.Trie' );
goog.require( 'picnet.Utils' );

/*
 * Create a delayed function which will be executed
 * in 1.5 seconds.
 */
var delay = new goog.async.Delay( function() {
	console.info( "Bye!" );
} ).start( 1500 );

/*
 * Create a trie and insert some data.
 */
var trie = new goog.structs.Trie();
trie.add( "demo", "node-goog" );
trie.add( "ex", [ "girlfriend", "parrot" ] );
trie.add( "example", { "hello": "world" } );

/*
 * A trie finds the associated data of all prefixes (of 'examples'
 * in this case) in O(L), where L is the length of the key:
 */
console.info( trie.getKeyAndPrefixes( "examples" ) );
console.info('Using picnet.Utils.isNull: ' + picnet.Utils.isNull(trie));