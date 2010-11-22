/*
 * Copyright 2010 Hendrik Schnepel (hendrik.schnepel@gmail.com)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
