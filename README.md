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

1. Include `node-goog` in your application through Node's standard mechanism:
    
        var goog = require( 'goog' ).goog;
    
2. Import any namespace from Google Closure like you would in a browser-based application:
    
        goog.require( 'goog.structs.Trie' );
    
3. Hack on!
    
        var trie = new goog.structs.Trie();
    
3. Start your application. Set `CLOSURE_BASE_PATH` according to your own configuration:
    
        CLOSURE_BASE_PATH=~/opt/closure-library/closure/goog/ node example.js


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
