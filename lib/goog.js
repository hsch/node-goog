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
	
	/*
	 * TODO: Closure defines a CLOSURE_BASE_PATH variable, too. Maybe
	 * we should overwrite that later?
	 */
	var closure_base_path = process.env['CLOSURE_BASE_PATH'] || './closure/goog/';
	
	/*
	 * TODO: This is how we will load and execute JavaScript files. The synchronous
	 * implementation seems to be appropriate for loading modules, but one
	 * could think about asynchronous loading anyway (especially for later
	 * calls to goog.require(...)).
	 */
	var scriptsWritten = {};
	
	function loadScript( context, basedir, filename ) {
		
		/*
		 * TODO: We need to ensure that no script is loaded
		 * twice because this would lead to an exception when
		 * a Closure namespace is declared more than once.
		 * 
		 * Not sure how Closure handles this, or whether the
		 * problem is only circumvented by their compiler.
		 */
		if ( scriptsWritten[ basedir + filename ] ) {
			return;
		}
		scriptsWritten[ basedir + filename ] = 1;
		
		var code = fs.readFileSync( basedir + filename, 'utf-8' );
		Script.runInNewContext( code, context, filename );
		
		/*
		 * If the Timer module has been loaded, provide the Node-
		 * specific implementation of the *Timeout and *Interval
		 * methods.
		 */
		if ( context.goog.Timer && !context.goog.Timer.defaultTimerObject ) {
			context.goog.Timer.defaultTimerObject = {
				"setTimeout": setTimeout,
				"clearTimeout": clearTimeout,
				"setInterval": setInterval,
				"clearInterval": clearInterval
			};
		}
	}
	
	/*
	 * This is our global context object which will be reused in all calls
	 * to goog.require and subsequential execution of Closure's scripts.
	 */
	var sandbox = {
		"console": console
	};
	
	/*
	 * Begin initializing Closure by loading the base module.
	 */
	loadScript( sandbox, closure_base_path, 'base.js' );
	
	/*
	 * goog.global points to the 'window' object in a browser environment. We
	 * replace that with our own global context.
	 */
	sandbox.goog.global = sandbox;
	
	/*
	 * Closure loads files by writing out <script> tags. This is fine in a browser
	 * but obviously we need to replace this behaviour to make things work on Node. 
	 */
	sandbox.goog.writeScriptTag_ = function( filename ) {
		return loadScript( sandbox, closure_base_path, filename );
	};
	
	/*
	 * We can now load the Closure dependency tree.
	 * 
	 * TODO: This completes the initialization - more or less. Some modules may
	 * require additional work, e.g. timer.js should access Node's implementation
	 * of setTimeout etc.
	 */
	loadScript( sandbox, closure_base_path, 'deps.js' );
	return sandbox.goog;	
})();
