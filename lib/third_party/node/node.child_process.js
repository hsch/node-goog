/**
 * @name node.child_process
 * @namespace
 * Node provides a tri-directional <code>popen(3)</code> facility through the <code>ChildProcess</code>
 * class.
 *
 * It is possible to stream data through the child's <code>stdin</code>, <code>stdout</code>, and
 * <code>stderr</code> in a fully non-blocking way.
 *
 * To create a child process use <code>require('child_process').spawn()</code>.
 *
 * Child processes always have three streams associated with them. <code>child.stdin</code>,
 * <code>child.stdout</code>, and <code>child.stderr</code>.
 *
 * <code>ChildProcess</code> is an <code>EventEmitter</code>.
 */

goog.provide("node.child_process");

/**
 * Launches a new process with the given <code>command</code>, with  command line arguments in <code>args</code>.
 * If omitted, <code>args</code> defaults to an empty Array.
 *
 * The third argument is used to specify additional options, which defaults to:
 * <pre>
 *     { cwd: undefined,
 *       env: process.env,
 *       customFds: [-1, -1, -1],
 *       setsid: false
 *     }
 * </pre>
 * <code>cwd</code> allows you to specify the working directory from which the process is spawned.
 * Use <code>env</code> to specify environment variables that will be visible to the new process.
 * With <code>customFds</code> it is possible to hook up the new process' [stdin, stout, stderr] to
 * existing streams; <code>-1</code> means that a new stream should be created. <code>setsid</code>,
 * if set true, will cause the subprocess to be run in a new session.
 *
 * Example of running <code>ls -lh &#47;usr</code>, capturing <code>stdout</code>, <code>stderr</code>, and the exit code:
 * <pre>
 *     var util   = require('util'),
 *         spawn = require('child<em>process').spawn,
 *         ls    = spawn('ls', ['-lh', '&#47;usr']);
 *
 *     ls.stdout.on('data', function (data) {
 *       console.log('stdout: ' + data);
 *     });
 *
 *     ls.stderr.on('data', function (data) {
 *       console.log('stderr: ' + data);
 *     });
 *
 *     ls.on('exit', function (code) {
 *       console.log('child process exited with code ' + code);
 *     });
 * </pre>
 *
 * Example: A very elaborate way to run 'ps ax | grep ssh'
 * <pre>
 *     var util   = require('util'),
 *         spawn = require('child</em>process').spawn,
 *         ps    = spawn('ps', ['ax']),
 *         grep  = spawn('grep', ['ssh']);
 *
 *     ps.stdout.on('data', function (data) {
 *       grep.stdin.write(data);
 *     });
 *
 *     ps.stderr.on('data', function (data) {
 *       console.log('ps stderr: ' + data);
 *     });
 *
 *     ps.on('exit', function (code) {
 *       if (code !== 0) {
 *         console.log('ps process exited with code ' + code);
 *       }
 *       grep.stdin.end();
 *     });
 *
 *     grep.stdout.on('data', function (data) {
 *       console.log(data);
 *     });
 *
 *     grep.stderr.on('data', function (data) {
 *       console.log('grep stderr: ' + data);
 *     });
 *
 *     grep.on('exit', function (code) {
 *       if (code !== 0) {
 *         console.log('grep process exited with code ' + code);
 *       }
 *     });
 * </pre>
 *
 * Example of checking for failed exec:
 * <pre>
 *     var spawn = require('child<em>process').spawn,
 *         child = spawn('bad</em>command');
 *
 *     child.stderr.on('data', function (data) {
 *       if (&#47;^execvp\(\)&#47;.test(data.asciiSlice(0,data.length))) {
 *         console.log('Failed to start child process.');
 *       }
 *     });
 * </pre>
 *
 * See also: <code>child_process.exec()</code>
 * @param {string} path
 * @param {Array.<*>} args
 * @param {Object} options
 * @param {string} customFds
 */
node.child_process.spawn = function(path, args, options, customFds) {
  return node.child_process.core_.spawn.apply(node.child_process.core_, arguments);
};

/**
 * High-level way to execute a command as a child process, buffer the
 * output, and return it all in a callback.
 * <pre>
 *     var util   = require('util'),
 *         exec  = require('child<em>process').exec,
 *         child;
 *
 *     child = exec('cat *.js bad</em>file | wc -l',
 *       function (error, stdout, stderr) {
 *         console.log('stdout: ' + stdout);
 *         console.log('stderr: ' + stderr);
 *         if (error !== null) {
 *           console.log('exec error: ' + error);
 *         }
 *     });
 * </pre>
 * The callback gets the arguments <code>(error, stdout, stderr)</code>. On success, <code>error</code>
 * will be <code>null</code>.  On error, <code>error</code> will be an instance of <code>Error</code> and <code>err.code</code>
 * will be the exit code of the child process, and <code>err.signal</code> will be set to the
 * signal that terminated the process.
 *
 * There is a second optional argument to specify several options. The default options are
 * <pre>
 *     { encoding: 'utf8',
 *       timeout: 0,
 *       maxBuffer: 200*1024,
 *       killSignal: 'SIGTERM',
 *       cwd: null,
 *       env: null }
 * </pre>
 * If <code>timeout</code> is greater than 0, then it will kill the child process
 * if it runs longer than <code>timeout</code> milliseconds. The child process is killed with
 * <code>killSignal</code> (default: <code>'SIGTERM'</code>). <code>maxBuffer</code> specifies the largest
 * amount of data allowed on stdout or stderr - if this value is exceeded then
 * the child process is killed.
 * @param {string} command
 * @param {Object} options
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.child_process.exec = function(command, options, callback) {
  return node.child_process.core_.exec.apply(node.child_process.core_, arguments);
};

/**
 * @param {string} file
 * @param {Object} options
 * @param {function(Error?,...[*]):undefined=} callback
 */
node.child_process.execFile = function(file, options, callback) {
  return node.child_process.core_.execFile.apply(node.child_process.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.child_process.core_ = require("child_process");