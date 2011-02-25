#!/usr/local/bin/node

// We are now in closure mode
require('nclosure').nclosure();

// Lets declare our namespace 'demo.listfiles'.  Its always a good idea
// to declare namespaces as polluting the global scope whilst not as
// critical in the server is still a bad practice.
goog.provide('demo.listfiles');

// Import some utilities from the closure libs
goog.require('goog.array');



/**
  * @constructor
  * @param {string} dir The directory to list.
  */
demo.listfiles = function(dir) {
  // Import some node utils
  this.fs_ = require('fs');
  this.path_ = require('path');
  var files = [];
  this.getFilesInDir_(files, dir);
  files.sort();
  console.log(files.join('\n'));
};


/**
  * @private
  * @param {Array.<string>} files
  * @param {string} dir
  */
demo.listfiles.prototype.getFilesInDir_ = function(files, dir) {
  var filesInDir = this.fs_.readdirSync(dir);
  goog.array.forEach(filesInDir, function(f) {
    var path = this.path_.resolve(dir, f);
    if (this.fs_.statSync(path).isDirectory()) {
      this.getFilesInDir_(files, path);
    } else {
      files.push(path);
    }
  }, this);
};

// List the files in the current directory
new demo.listfiles(__dirname);
