# node-goog: Google Closure Tools in Node.js

## Overview

The [Google Closure Tools](http://code.google.com/closure/) are a powerful set
of utilities that aim to make large scale JavaScript development more
manageable.  This project brings the power of the closure tools to the
[node](http://www.nodejs.org)
platform. The closure tools gives developers the utilities required to improve
code design and maintainability by providing support for:

* Enhanced Modularisation (Both logically and physically)
* Better Encapsulation
* Type Safety
* Interfaces and Mixins
* Rich Documentation
* A Huge Library of Production Ready Utilities, including:
	* Collections / Arrays
	* Testing / Mocking
	* Async Development
	* Encryption
	* Date / Date Range Support
	* Events
	* Internationalisation
	* Locale
	* Math
	* String
	* Structs
	* [More...](http://closure-library.googlecode.com/svn/docs/index.html)


## Installation (core)

* Install `node-goog`.  By either:

			npm install goog

	or get the source (recommended so you can help out):

			git clone git://github.com/hsch/node-goog.git
			cd node-goog
			npm link

## Closure Library

For full details on utilities provided in the closure library refer to the
[official docs](http://closure-library.googlecode.com/svn/docs/index.html).
To use any utility provided in the closure library just:

1. Include `node-goog` in your application by `require`(ing) it and initialising
it.

		require('goog').goog.init();

2. `goog.require` any namespace from the Closure library.

        goog.require('goog.structs.Trie');

3. That's it, use the imported namespaces anywhere in your file.

        var trie = new goog.structs.Trie();

## Closure Compiler

Using the [Closure Compiler](http://code.google.com/closure/compiler/) requires
a small investment in learning but once you have worked your way through the
[docs](http://code.google.com/closure/compiler/) you can take advantage of the
compiler's support for:

* Enhanced Code Documentation
* Type Safety
* Encapsulation
* Modularisation
* Enhanced Inheritance and Interfaces
* Scalability

Once your source code is
[annotated](http://code.google.com/closure/compiler/docs/js-for-compiler.html)
and ready for compilation just run the following command:

		googcompile source.js

The `googcompile` command accepts various arguments:

* -c: Create [C]ompile file - Produces a compiled <filename>.min.js file
* -d: Create [D]ependencies- Creates a deps.js file that can be used as an
additionalDeps in an external project.

## JSDoc Documentation

To run `node-goog`'s documentation tool simply run:

    googdoc <directory or source file>

For full documentation details please read the
[official jsdoc-toolkit docs](://code.google.com/p/jsdoc-toolkit/).

## Closure Testing

`node-goog` supports testing using Closure's 'goog.testing.jsunit' test tools.
To set up a unit test simply create a test file like:

    #!/usr/local/bin/node
    require('goog').goog.init();

    goog.require('goog.testing.jsunit');
    // Import the code you are testing
    goog.require('node.goog.examples.simple.Example');

    goog.provide('node.goog.examples.simple.tests.syncTests');

    // Any testXXX function are auto-discovered and run
    var testFunction1 = function() {
      assertNotEquals(typeof(example_), 'undefined');
    };

    function testFunction2() {
      assertTrue(false);
    }

If the tests are not in the same directory as your code you will have to
ensure that the deps.js file of the code you are testing
is declared in the closure.json file of the tests directory or passed in to the
call to `goog.init();` like:

    require('goog').goog.init({additionalDeps:['/pathToDeps/deps.js']});

To run a single test just execute:

    ./testSourceFile.js <optionalTestName>

To run all tests in a single directory run the following command:

      googtest <dirname>

## Closure Linter

For detailed code style checking you can also use `node-goog`'s
linter support.  To use linter you will need to download and install
[Closure Linter](http://code.google.com/closure/utilities/index.html).

Closure Linter checks your code against Google's own
[JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
which is a mature and highly scalable framework for developing JavaScript code.

To install Closure Linter read the following
[page]( http://code.google.com/closure/utilities/docs/linter_howto.html).

Once installed simply run the following command to `linter` your code.

		googcodecheck <directory>

## Advanced Configuration

`node-goog` can be configured in several ways.  The easiest is to modify the
`bin/closure.json` file with your global settings.  Settings here can be
extended by placing a `closure.json` file in your source directory. You can
also place a `closure.json` in the directory running `node`.

Finally, `node-goog` can also be configured by passing an optional options
object to the `require('goog').goog.init(opts);` call.

All configuration files and configuration objects take the following format:

        {
          closureBasePath: Location of the closure-library/closure/goog/
              directory
          additionalDeps: Any additional dependency files required to run your
              code.  These files generally point to other closure libraries.
              Note these deps files must have paths relative to this setting
              file or be absolute.
          compiler_jar: Path to the compiler jar you want to use.  This defaults
            to the included compiler.jar file so only change this if you want
            to use a custom compiler.
          additionalCompileOptions: Additional compiler options,
            e.g.: "['--jscomp_warning=newWarningType']"
          additionalCompileRoots: These are directories containing source code
            that needs to be included in the compilation.  If this is not
            included then additionalDeps is used to try to guess any additional
            roots required (assumes that the deps.js file is in the root folder
            of the source directory).
          jsdocToolkitDir: The location of jsdoc-toolkit.  This is only required
            if you want to use jsdoc-toolkit to document your source code.
          additionalJSDocToolkitOptions: Additional jsdoc-toolkit options,
            e.g.: "['-D="noGlobal:true"']"
          additionalLinterOptions: Additional gjslint and fixjsstyle options,
            e.g.: "['--summary=true']"
          nodeDir: The location of the node source code.  This is only required
            if you are contributing to the node-goog project or would like to
            update your node-extern files.
        }

Note: All paths can be absolute or relative to the location of the current
settings file.

## Acknoledgements
My sincerest appreciation to Google for open sourcing this awesome toolset.
Thanks to the jsdoc-toolkit guys (Michael Mathews + co) and to Wouter Bos for
his awesome jsdoc-toolkit template.  Thanks also to Aaron Wirtz for his
[node-jsdoc-toolkit](https://github.com/p120ph37/node-jsdoc-toolkit) project.


## License

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
