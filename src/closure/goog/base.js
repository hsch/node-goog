var fs = require('fs');
var Script = process.binding('evals').Script;

exports.goog = (function() {
	
	var closure_home = process.env['CLOSURE_BASE_PATH'] || './closure/goog/';
	
	function loadScript(context, basedir, filename) {
		var code = fs.readFileSync(basedir + filename, 'utf-8');
		Script.runInNewContext(code, sandbox, filename);
	}
	
	var sandbox = {
	};
	
	loadScript(sandbox, closure_home, 'base.js');
	
	sandbox.goog.global = sandbox;
	
	sandbox.goog.writeScriptTag_ = function(filename) {
		return loadScript(sandbox, closure_home, filename);
	};
	
	loadScript(sandbox, closure_home, 'deps.js');
	
	return sandbox.goog;	
})();
