
goog.provide('node.goog.tests');

goog.require('goog.array');

node.goog.tests.fs_ = require('fs');
node.goog.tests.path_ = require('path');
node.goog.tests.child_process_ = require('child_process');

/**
 * @param {string} dir The directory to read all files for
 * @param {string|RegExp=} filter An optional regex filter that the full file
 *    name must match
 * @return {Array.<string>} A list of all files in the specified directory
 *    (recursive) that optionally match the specified filter regex.
 */
node.goog.tests.readDirRecursiveSync = function(dir, filter) {
  var files = [];
  node.goog.tests.readDirRecursiveSyncImpl_(dir, files);
  if (filter) {
    filter = typeof(filter) === 'string' ? new RegExp(filter) : filter;
    files = goog.array.filter(files, function(f) {
      return f.match(filter);
    });
  }
  return files;
};

/**
 * @private
 */
node.goog.tests.readDirRecursiveSyncImpl_ = function(dir, allFiles) {
  var files = node.goog.tests.fs_.readdirSync(dir);
  goog.array.forEach(files, function(f) {
    var path = node.goog.instance.getPath(dir, f);
    if (node.goog.tests.fs_.statSync(path).isDirectory()) {
      return node.goog.tests.readDirRecursiveSyncImpl_(path, allFiles);
    } {
      allFiles.push(path);
    }
  });
};

/**
 * Removes a specified directory and all its contents.
 */
node.goog.tests.rmRfDir = function (dir, callback) {
  node.goog.tests.child_process_.exec('rm -rf ' + dir, callback);
};

/**
 * @param {Array.<string>} execCommands Commands to execute
 * @param {function(string, Error, string, string):undefined} callback
 *    The callback to call when the exec command completes this command. The
 *    Arguments are: command, Error, stderr and stdout
 * @param {function():undefined} oncomplete Called when all commands are
 *    finnished
 * @param {number=} max The maximum number of separate processes to create
 */
node.goog.tests.paralleliseExecs =
    function(execCommands, callback, oncomplete, max) {
  if (!max || max <= 0 || max >= execCommands.length) {
    var remaining = execCommands.length;
    goog.array.forEach(execCommands, function(c) {
      node.goog.tests.child_process_.exec(c, function(err, stderr, stdout) {
        if (callback) callback(c, err, stderr, stdout);
        if (--remaining === 0) oncomplete();
      });
    });
  } else {
    var commands = goog.array.clone(execCommands);
    node.goog.tests.runNextCommandImpl_(commands, callback, oncomplete, max);
  }
};

/**
 * @private
 * @type {number}
 */
node.goog.tests.runningCommands_ = 0;

/**
 * @private
 * @param {Array.<string>} execCommands Commands to execute
 * @param {function(string, Error, string, string):undefined} callback
 *    The callback to call when the exec command completes this command. The
 *    Arguments are: command, Error, stderr and stdout
 * @param {function():undefined} oncomplete Called when all commands are
 *    finnished
 * @param {number=} max The maximum number of separate processes to create
 */
node.goog.tests.runNextCommandImpl_ =
    function(execCommands, callback, oncomplete, max) {
  if (execCommands.length <= 0 || node.goog.tests.runningCommands_ >= max) return;

  node.goog.tests.runningCommands_++;
  var command = execCommands.pop();
  node.goog.tests.child_process_.exec(command, function(err, stderr, stdout) {
    node.goog.tests.runningCommands_--;
    node.goog.tests.runNextCommandImpl_(
        execCommands, callback, oncomplete, max);
    if (callback) callback(command, err, stderr, stdout);
    if (node.goog.tests.runningCommands_ === 0 && execCommands.length === 0) {
      return oncomplete();
    }
  });

  if (node.goog.tests.runningCommands_ < max - 1) {
    node.goog.tests.runNextCommandImpl_(
        execCommands, callback, oncomplete, max);
  }
};