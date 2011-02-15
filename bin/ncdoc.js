#!/usr/local/bin/node


/**
 * @private
 * @type {nclosure}
 * @const
 */
var ng_ = require('nclosure').nclosure();

goog.provide('nclosure.ncdoc');

goog.require('goog.array');
goog.require('nclosure');
goog.require('nclosure_opts');



/**
 * @constructor
 */
nclosure.ncdoc = function() {
  var args = ng_.args;
  if (!args.jsdocToolkitDir) {
    throw new Error('To run the jsdoc-toolkit documentation module please ' +
        'specify a jsdocToolkitDir property pointing to the jsdoc-toolkit ' +
        'root directory.  This setting can reside in the global closure.json ' +
        'settings file or the closure.json file in the code root dir');
  }

  /**
   * @private
   * @const
   * @type {{init:function(Array.<string>)}}
   */
  this.jsdoc_toolkit_ =
      require('../third_party/node-jsdoc-toolkit/app/noderun').jsdoctoolkit;

  /**
   * @private
   * @type {Array.<string>}
   */
  this.clArgs;

  this.init_(args);
};


/**
 * @private
 * @param {nclosure_opts} args The settings object.
 */
nclosure.ncdoc.prototype.init_ = function(args) {
  // _dirToDoc is for testing so tests can set this global before calling
  // goog.require('nclosure.ncdoc')
  this.createJSDocArgs_(args, global['_dirToDoc'] || process.argv[2]);

  // Run node-jsdoc-toolkit
  this.runJSDocToolkit_();
};


/**
 * @private
 * @param {nclosure_opts} args The settings object.
 * @param {string} entryPoint The file/directory to document.
 */
nclosure.ncdoc.prototype.createJSDocArgs_ = function(args, entryPoint) {
  var entryPointDirIdx = entryPoint.lastIndexOf('/');
  var title = entryPointDirIdx > 0 ?
      entryPoint.substring(entryPointDirIdx + 1) : entryPoint;
  var entryPointDir = entryPointDirIdx > 0 ?
      entryPoint.substring(0, entryPointDirIdx) : '.';
  var jsDocToolkitDir = args.jsdocToolkitDir;

  this.clArgs = [
    '-t=' +
        ng_.getPath(jsDocToolkitDir, 'templates/codeview'),
    '-d=' + ng_.getPath(entryPointDir, '/docs'),
    '-D="title:' +
        title + '"'
  ];
  if (args.additionalJSDocToolkitOptions) {
    this.clArgs = goog.array.concat(this.clArgs,
        args.additionalJSDocToolkitOptions);
  }
  this.clArgs.push(entryPoint);
};


/**
 * @private
 */
nclosure.ncdoc.prototype.runJSDocToolkit_ = function() {
  this.jsdoc_toolkit_.init(this.clArgs);
};


/** @type {nclosure.ncdoc} */
exports.googDoc = new nclosure.ncdoc();
