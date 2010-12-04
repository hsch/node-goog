/*
 * Load node-goog through Node's standard mechanism, then
 * use Closure's way of importing namespaces.
 */
var goog = require( 'goog' ).goog;
goog.require( 'goog.structs.Trie' );

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
