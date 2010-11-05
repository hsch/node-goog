var fs = require( "fs" );
var util = require('util'),
    Script = process.binding('evals').Script;
	
exports.goog = (function() {
	
	var base = fs.readFileSync("/home/hsch/gitbased/moosetalk/lib/closure-library/closure/goog/base.js", "utf-8");
	var deps = fs.readFileSync("/home/hsch/gitbased/moosetalk/lib/closure-library/closure/goog/deps.js", "utf-8");
	
	var sandbox = {
		"goog": { }
	};
	
	Script.runInNewContext( base, sandbox, "base.js" );
	
	sandbox.goog.global = sandbox;
	
	sandbox.goog.writeScriptTag_ = function( src ) {
		console.info( "write tag: " + src)
		var code = fs.readFileSync("/home/hsch/gitbased/moosetalk/lib/closure-library/closure/goog/" + src, "utf-8");
		Script.runInNewContext( code, sandbox, src );
	};
	
	Script.runInNewContext( deps, sandbox, "deps.js" );

	return sandbox.goog.global.goog;
})();
