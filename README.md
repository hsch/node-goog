node-goog: Server-side Google Closure with Node.js
==================================================

Synopsis
--------

The Google Closure library is a powerful JavaScript framework and includes features which are also interesting outside of a browser environment,
e.g. implementations of common algorithms (encryption, geometry, time and date handling, ...), data structures (tries, pools, priority queues, ...)
and support for functional programming. `node-goog` aims at making these features available on the Node.js platform.

Installation
------------

1. You will need a separate installation of Google's [Closure Library](http://code.google.com/closure/library/docs/gettingstarted.html).

2. `node-goog` itself is available as an [npm](http://npmjs.org/) package:
    
        npm install goog

    Or, get the source, fiddle around with it and install `node-goog` locally:

        git clone git://github.com/hsch/node-goog.git
        cd node-goog
        npm link

Usage
-----

1. Add a closure.json object to the root of your source code.  Here you can 
  specify the following attributes:
    closureBasePath: Location of the closure-library/closure/goog/ directory 
    additionalDeps: Any additional dependency files required to run your code.  
        These files generally point to other closure libraries.  Note these deps 
        files must have paths relative to the same closureBasePath as specified 
        above.
    compiler_jar: Path to the compiler jar you want to use.  
      Default: 'compiler.jar'
    additionalCompileOptions: Additional compiler options, 
      e.g: --jscomp_warning=newWarningType
    additionalCompileRoots: These are directories containing source code that 
      needs to be included in the compilation.  If this is not included then 
      additionalDeps is used to try to guess any additional roots required 
      (assumes that the deps.js file is in the root folder of the 
      source directory).
2. Include `node-goog` in your application through Node's standard mechanism:
    
        var goog = require( 'goog' ).goog;

3. Initialise the goog object.  This can take in an options object with the same
  options as specified in step 1.
  
        goog.init();
        
4. Import any namespace from Google Closure like you would in a browser-based 
  application:
    
        goog.require( 'goog.structs.Trie' );
    
5. Hack on!
    
        var trie = new goog.structs.Trie();    
    
License
=======

Copyright 2010 Hendrik Schnepel (hendrik.schnepel@gmail.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
