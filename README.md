node-goog: Server-side Google Closure with Node.js
==================================================

Synopsis
--------

The Google Closure library is a powerful JavaScript framework and includes 
features which are also interesting outside of a browser environment, e.g. 
implementations of common algorithms (encryption, geometry, time and date 
handling, ...), data structures (tries, pools, priority queues, ...) and support 
for functional programming. `node-goog` aims at making these features available 
on the Node.js platform.

Installation
------------

1. You will need a separate installation of Google's [Closure Library] 
  (http://code.google.com/closure/library/docs/gettingstarted.html). The 
  easiest way of getting this is by running the following command in 
  an appropriate folder:
  
        svn checkout http://closure-library.googlecode.com/svn/trunk/

2. (Optional) If you will be using node-goog to generate documentation for your
  code then you will also need to download jsdoc-toolkit 
  (http://code.google.com/p/jsdoc-toolkit/).  The best way to get your hands
  on the jsdoc-toolkit is by running the following command in an appropriate 
  folder:
  
        svn checkout http://jsdoc-toolkit.googlecode.com/svn/trunk/

3. (Optional) For detailed code style checking you can also use node-goog's
  linter support.  To use linter you will need to download Google's 
  [Closure Linter] (http://code.google.com/closure/utilities/index.html).  
  Closure Linter checks your code agains Google's own JavaScript Style Guide
  which is a mature and tested framework for developing JavaScript code:
  http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
  To install CLosure Linter read the following page:
  http://code.google.com/closure/utilities/docs/linter_howto.html
    
4. `node-goog` itself is available as an [npm](http://npmjs.org/) package:
    
        npm install goog

    Or, get the source, fiddle around with it and install `node-goog` locally:

        git clone git://github.com/hsch/node-goog.git
        cd node-goog
        npm link
        
        
5. Configure node-goog:  This can be done in several ways.  The easiest is to
  edit the global configuration file (closure.json) which can be found in 
  the ./bin/ directory of node-goog.  This is the ideal place to define certain 
  paths that will not chage accross multiple projects.
  
  You can also include a closure.json file in the root of your source projects.
  So the closure.json file should reside beside the entry file into your 
  project.
  
  The closure.json file can finally reside in the directory that you are calling
  the node-goog command from.
  
  Optionally, when calling require( 'goog' ).goog.init(opts) you can also pass 
  in the configuration object.
  
  The configuration files and the configuration object (passed to 
  require( 'goog' ).goog.init(opts) ) take the following format:
      
        {
          closureBasePath: Location of the closure-library/closure/goog/ 
              directory 
          additionalDeps: Any additional dependency files required to run your 
              code.  These files generally point to other closure libraries.  
              Note these deps files must have paths relative to the same 
              closureBasePath as specified above.
          compiler_jar: Path to the compiler jar you want to use.  This defaults
            to the included compiler.jar file so only change this if you want
            to use a custom compiler.            
          additionalCompileOptions: Additional compiler options, 
            e.g: --jscomp_warning=newWarningType
          additionalCompileRoots: These are directories containing source code 
            that needs to be included in the compilation.  If this is not 
            included then additionalDeps is used to try to guess any additional 
            roots required (assumes that the deps.js file is in the root folder 
            of the source directory).
          jsdocToolkitDir: The location of jsdoc-toolkit.  This is only required
            if you want to use jsdoc-toolkit to document your source code.
          nodeDir: The location of the node source code.  This is only required
            if you are contributing to the node-goog project or would like to 
            update your node-extern files.          
        }
Usage
-----

1. Include `node-goog` in your application through Node's standard mechanism:
    
        var goog = require( 'goog' ).goog;

2. Initialise the goog object.  This can take in an options object with the same
  format as specified above in the 'Configure node-goog' section.
  
        goog.init();
          or
        goog.init(opts); //  Where opts is the options object
        
3. Import any namespace from Google Closure like you would in a browser-based 
  application:
    
        goog.require( 'goog.structs.Trie' );
    
4. Hack on!
    
        var trie = new goog.structs.Trie();    

Compile
=======

The Google Closure Compiler is a JavaScript -> JavaScript compiler that gives
your code the following features:
  - Optimised Code
    The compiler usually results in faster JavaScript with faster load times
  - Type-Safety  
  - Better Encapsulation Support
  - Interface Implementation and Object Enhanced Inheritance 
  - JSDoc Style Code Documentation

Whilst faster load times may not be a great incentive to compile your code on 
the server the other benefits that compilation can give you are a great way 
of writing robust quality code.
  
Writing code that is closure compiler compatible does require a small learning 
curve and is quite verbose so this is something that should only be done for
larger projects.  However having code that is closure compiled is more 
manageable, scalable and mantainable in the future.  See the closure compiler
documentation on Google's site for more details:
    http://code.google.com/closure/compiler/
    
To compile you javascript code simply run:

          googcompile source.js
          
Code Check
==========    
If you have chosen to use Closure Compiled source code then you can also run
Google's Linter tool onyour code.  To read more about Google Closure Linter see
    http://code.google.com/closure/utilities/index.html
    
To run linter on your code simply run:

          googcodecheck source.js
            or
          googcodecheck srcdir/
        
Documentation
=============
Writing Closure Compiled source means that you already have some great code
documentation that can be leveraged for your API docs.  To document your code
simply run:

        googdoc source.js
        
Note: This uses jsdoc-toolkit for documentation.  To read more about 
jsdoc-toolkit see the official site:
    http://code.google.com/p/jsdoc-toolkit/


Testing
=======
node-goog supports testing using CLosure's 'goog.testing.jsunit' test tools. To 
set up a unit test simply create a file like this:

        #!node
        // You can pass additional deps (to the source code being tested) here 
        // or decalre in closure.json
        require('goog').goog.init(); 

        goog.require('goog.testing.jsunit');
        // Import the code you are testing
        goog.require('node.goog.examples.simple.Example'); 

        goog.provide('node.goog.examples.simple.tests.syncTests');
        
        // Any testXXX function are auto-discovered and run
        testFunction1 = function() {
          assertNotEquals(typeof(example_), 'undefined');
        };

You will also have to ensure that the deps.js file of the code you are testing
is declared in the closure.json file of the tests directory.

Note: Due to the internals of global scoping in Node you must declare your 
tests like this:

    testFunctionName = function() { ....
    
You cannot declare tests like this:

      var testName = function() { ...
      or
      function testName() { ...       

To run all tests in a single directory run the following command:

      googtest <dirname>
      
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
