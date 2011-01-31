
/**
 * @fileoverview Copyright 2011 Guido Tapia (guido@tapia.com.au)
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
if (typeof(goog) !== 'undefined') {
  goog.provide('node.goog');    
  goog.require('goog.Timer');    
} 

/**
 * @constructor
 */
function NodeGoog() {
  /**
   * @private
   * @type {Array.<number>}
   */
  this.scriptsWritten_ = {};
  /**
   * @private
   * @type {Array.<number>}
   */
  this.testingInitialised_ = false;
};

/**
 * @type {boolean}
 */
NodeGoog.initialised_ = false;

/** 
 * @suppress  {accessControls} 
 * @param {node_goog.opts=} opts Parameters object
 */
NodeGoog.prototype.init = function(opts) {  
  if (NodeGoog.initialised_) return;
  NodeGoog.initialised_ = true;
  
  var fs = require('fs'),
    path = require('path'),
    Script = process.binding('evals').Script,
    utils = require('../bin/utils').closureUtils;
  opts = opts || utils.readSettingObject();  
    
	/*
	 * TODO: This is how we will load and execute JavaScript files. The synchronous
	 * implementation seems to be appropriate for loading modules, but one
	 * could think about asynchronous loading anyway (especially for later
	 * calls to goog.require(...)).
	 */	
	var that = this;
	function loadScript( basedir, filename ) {      
		var path = filename.indexOf('/') === 0 ? filename : basedir + filename;
		/*
		 * TODO: We need to ensure that no script is loaded
		 * twice because this would lead to an exception when
		 * a Closure namespace is declared more than once.
		 * 
		 * Not sure how Closure handles this, or whether the
		 * problem is only circumvented by their compiler.
		 */
		if ( that.scriptsWritten_[ path ] ) { return; }
		that.scriptsWritten_[ path ] = 1;

		var code = fs.readFileSync( path, 'utf-8' ).replace(/^#!node/, '');         
    Script.runInThisContext.call( global, code );    
    /*
     * If we are using the testing framework lets initialise it.
     */
    if (goog.testing && !that.testingInitialised_) {
      that.testingInitialised_ = true;
      that.initialiseTestingFramework_(); 
    }  
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
	goog.global = goog.window = global.window = global.top = global;    
  	
	/*
	 * Closure loads files by writing out <script> tags. This is fine in a browser
	 * but obviously we need to replace this behaviour to make things work on Node. 
	 */
	goog.writeScriptTag_ = function( filename ) {
		loadScript( opts.closureBasePath, filename );
    return false;
	};
	
	/*
	 * We can now load the Closure dependency tree.
	 * 
	 * TODO: This completes the initialization - more or less. Some modules may
	 * require additional work, e.g. timer.js should access Node's implementation
	 * of setTimeout etc.
	 */
	loadScript( opts.closureBasePath, 'deps.js' );
  var file = process.argv[1];
  var depsPath = file.substring(0, file.lastIndexOf('/') + 1);  
  
  if (file.indexOf('compile.js') < 0 && 
      path.existsSync(depsPath + 'deps.js')) {    
    loadScript(depsPath, 'deps.js' );  
  }
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

/** 
 * When we detect testcase.js loaded we add a few hooks and hacks to ensure that 
 *    the tests work as expected
 * @suppress  {accessControls}  
 */
NodeGoog.prototype.initialiseTestingFramework_ = function() {      
  global.require = require;
  global.navigator = {userAgent:'node.js'};
  var file = process.argv[1];
  // This can be used to set the specific test
  window.location = {
    search:'',
    href:file.split('?')[0]
  }; 
  
  var logElement = {};
  document = { 
    title:'Node.js Google Closure Test Suite' ,
    write: function(str) { },
    getElementById: function(id) { return logElement; },
  };
  
  var that = this;
  setTimeout(function() { // Wait untill all files are loaded
    that.initialiseTestingFramework2_();
  }, 1); 
};

/** 
 * When we detect testcase.js loaded we add a few hooks and hacks to ensure that 
 *    the tests work as expected
 * @suppress  {accessControls}  
 */
NodeGoog.prototype.initialiseTestingFramework2_ = function() {    
  var that = this;
  if (typeof (goog.testing) !== 'undefined' && 
      typeof (goog.testing.TestRunner) !== 'undefined') {
    goog.testing.TestCase.prototype.countNumFilesLoaded_ = 
      function() { return 0;  }
    goog.testing.TestRunner.prototype.onComplete_ = function() {}; 
  }  
    
  window.onload(); // Start the tests
};

exports.goog = new NodeGoog();