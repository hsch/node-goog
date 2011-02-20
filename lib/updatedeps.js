#!/usr/local/bin/node

/**
 * @fileoverview Will in the future update all third party dependencies.
 * Currently only updates the closure library from the CLOSURE_LIB_URL svn
 * repo.
 *
 * @author guido@tapia.com.au (Guido Tapia)
 */


/**
 * @private
 * @type {nclosure.core}
 * @const
 */
var ng_ = require('nclosure').nclosure();

goog.provide('nclosure.updatedeps');

goog.require('goog.array');
goog.require('nclosure.core');



/**
 * @constructor
 */
nclosure.updatedeps = function() {
  var opts = ng_.args;
  this.chdirToThirdPartiesDir_();
  this.updateClosureLibrary_();
};

/**
 * @private
 * @const
 * @type {string}
 */
nclosure.updatedeps.CLOSURE_LIB_DIR = 'closure-library';

/**
 * @private
 * @const
 * @type {string}
 */
nclosure.updatedeps.CLOSURE_LIB_URL =
  'http://picnet-closure-library-fork.googlecode.com/svn/trunk/closure-library';

/**
 * @private
 * @const
 * @type {string}
 */
nclosure.updatedeps.THIRD_PARTIES_DIR = '../third_party';

/**
 * @private
 */
nclosure.updatedeps.prototype.updateClosureLibrary_ = function() {
  var that = this;
  var tmp = this.moveDirToTmp_(nclosure.updatedeps.CLOSURE_LIB_DIR,
      function() {
    var command =
      'svn export ' + nclosure.updatedeps.CLOSURE_LIB_URL + ' ' +
      nclosure.updatedeps.CLOSURE_LIB_DIR;
    that.runCommand_(command,
      goog.bind(that.updateClosureLibraryCallback_, that));
  });
};

/**
 * @private
 * @param {Error} err
 */
nclosure.updatedeps.prototype.updateClosureLibraryCallback_ = function(err) {
  var tmp = nclosure.updatedeps.CLOSURE_LIB_DIR + '.tmp';
  if (err) {
    return this.revertDirMove_(tmp, function() {
      console.error('Error running command: ' + command +
        '\nChange reverted');
    });
  }
  try {
    require('fs').chmodSync(nclosure.updatedeps.CLOSURE_LIB_DIR +
      '/closure/bin/build/depswriter.py', 0755);
    require('fs').chmodSync(nclosure.updatedeps.CLOSURE_LIB_DIR +
      '/closure/bin/build/closurebuilder.py', 0755);
  } catch (err) {
    console.error(err);
  };

  require('child_process').exec('rm -rf ' + tmp, function() {
    console.log('Successfuly updated the closure library');
  });
};

/**
 * @private
 */
nclosure.updatedeps.prototype.chdirToThirdPartiesDir_ = function() {
  process.chdir(ng_.getPath(__dirname, nclosure.updatedeps.THIRD_PARTIES_DIR));
};

/**
 * @private
 * @param {string} command The command to execute
 * @param {function(Error):undefined} callback The oncomplete callback
 */
nclosure.updatedeps.prototype.runCommand_ = function(command, callback) {
  var cmd = require('child_process').exec(command,
    function(err, stdout, stderr) {
      if (stderr) console.error(stderr);
      if (stdout) console.log(stdout);
      callback(err);
  });
};


/**
 * @private
 * @param {string} dir the directory to move to a tmp location
 * @param {function():undefined} callback The oncomplete callback
 * @return {string} The new tmp directory
 */
nclosure.updatedeps.prototype.moveDirToTmp_ = function(dir, callback) {
  if (!require('path').existsSync(dir)) { return; }

  var tmp = dir + '.tmp';
  if (require('path').existsSync(tmp)) {
    require('child_process').exec('rm -rf ' + tmp, function() {
      require('fs').renameSync(dir, tmp);
      callback();
    });
  } else {
    require('fs').renameSync(dir, tmp);
    callback();
  }
  return tmp;
};

/**
 * @private
 * @param {string} dir the directory to move un tmp
 * @param {function():undefined} callback The oncomlete callback
 */
nclosure.updatedeps.prototype.revertDirMove_ = function(dir, callback) {
  var untmp = dir.replace('.tmp', '');
  var that = this;
  if (require('path').existsSync(untmp)) {
    require('child_process').exec('rm -rf ' + untmp, function() {
      that.revertDirMoveImpl_(dir, untmp, callback);
    });
  } else {
    this.revertDirMoveImpl_(dir, untmp, callback);
  };
};

/**
 * @private
 * @param {string} from the directory to move un tmp
 * @param {string} to the directory to move un tmp
 * @param {function():undefined} callback The oncomlete callback
 */
nclosure.updatedeps.prototype.revertDirMoveImpl_ = function(from, to, callback) {
  require('fs').rename(from, to, callback);
};

// Go!!
new nclosure.updatedeps();