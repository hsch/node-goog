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

function NodeGoog() {};

NodeGoog.prototype.init = function(opts) {
  opts.closureBasePath = opts.closureBasePath || './closure/goog/';
  opts.additionalDeps = opts.additionalDeps || [];

	/*
	 * TODO: This is how we will load and execute JavaScript files. The synchronous
	 * implementation seems to be appropriate for loading modules, but one
	 * could think about asynchronous loading anyway (especially for later
	 * calls to goog.require(...)).
	 */
	var scriptsWritten = {};
	
	function loadScript( basedir, filename ) {
		
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
		Script.runInThisContext.call( global, code );
		
		/*
		 * If the Timer module has been loaded, provide the Node-
		 * specific implementation of the *Timeout and *Interval
		 * methods.
		 */
		if ( goog.Timer && !goog.Timer.defaultTimerObject ) {
			goog.Timer.defaultTimerObject = {
				"setTimeout": setTimeout,
				"clearTimeout": clearTimeout,
				"setInterval": setInterval,
				"clearInterval": clearInterval
			};
		}
	}
		
	/*
	 * Begin initializing Closure by loading the base module.
	 */
	loadScript( opts.closureBasePath, 'base.js' );
	
	/*
	 * goog.global points to the 'window' object in a browser environment. We
	 * replace that with our own global context.
	 */
	goog.global = global;
	
	/*
	 * Closure loads files by writing out <script> tags. This is fine in a browser
	 * but obviously we need to replace this behaviour to make things work on Node. 
	 */
	goog.writeScriptTag_ = function( filename ) {
		return loadScript( opts.closureBasePath, filename );
	};
	
	/*
	 * We can now load the Closure dependency tree.
	 * 
	 * TODO: This completes the initialization - more or less. Some modules may
	 * require additional work, e.g. timer.js should access Node's implementation
	 * of setTimeout etc.
	 */
	loadScript( opts.closureBasePath, 'deps.js' );
  
  /*
   * Load any additional deps declared.
   */
  if (opts.additionalDeps) {    
    for (var i = 0, len = opts.additionalDeps.length; i < len; i++) {
      var fileName = opts.additionalDeps[i];      
      var idx = fileName.lastIndexOf('/');
      loadScript( fileName.substring(0, idx + 1), 
        fileName.substring(idx + 1) );
    }
  }	
};

exports.goog = new NodeGoog();