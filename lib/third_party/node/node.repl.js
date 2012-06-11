/**
 * @name node.repl
 * @namespace
 * A Read-Eval-Print-Loop (REPL) is available both as a standalone program and easily
 * includable in other programs.  REPL provides a way to interactively run
 * JavaScript and see the results.  It can be used for debugging, testing, or
 * just trying things out.
 *
 * By executing <code>node</code> without any arguments from the command-line you will be
 * dropped into the REPL. It has simplistic emacs line-editing.
 * <pre>
 *     mjr:~$ node
 *     Type '.help' for options.
 *     > a = [ 1, 2, 3];
 *     [ 1, 2, 3 ]
 *     > a.forEach(function (v) {
 *     ...   console.log(v);
 *     ...   });
 *     1
 *     2
 *     3
 * </pre>
 * For advanced line-editors, start node with the environmental variable <code>NODE<em>NO</em>READLINE=1</code>.
 * This will start the REPL in canonical terminal settings which will allow you to use with <code>rlwrap</code>.
 *
 * For example, you could add this to your bashrc file:
 * <pre>
 *     alias node="env NODE<em>NO</em>READLINE=1 rlwrap node"
 * </pre>
 */

goog.provide("node.repl");

/**
 * @param {Object} obj
 * @param {string} showHidden
 * @param {number} depth
 * @param {string} colors
 */
node.repl.writer = function(obj, showHidden, depth, colors) {
  return node.repl.core_.writer.apply(node.repl.core_, arguments);
};

/**
 * Starts a REPL with <code>prompt</code> as the prompt and <code>stream</code> for all I&#47;O.  <code>prompt</code>
 * is optional and defaults to <code>> </code>.  <code>stream</code> is optional and defaults to
 * <code>process.stdin</code>.
 *
 * Multiple REPLs may be started against the same running instance of node.  Each
 * will share the same global object but will have unique I&#47;O.
 *
 * Here is an example that starts a REPL on stdin, a Unix socket, and a TCP socket:
 * <pre>
 *     var net = require("net"),
 *         repl = require("repl");
 *
 *     connections = 0;
 *
 *     repl.start("node via stdin> ");
 *
 *     net.createServer(function (socket) {
 *       connections += 1;
 *       repl.start("node via Unix socket> ", socket);
 *     }).listen("&#47;tmp&#47;node-repl-sock");
 *
 *     net.createServer(function (socket) {
 *       connections += 1;
 *       repl.start("node via TCP socket> ", socket);
 *     }).listen(5001);
 * </pre>
 * Running this program from the command line will start a REPL on stdin.  Other
 * REPL clients may connect through the Unix socket or TCP socket. <code>telnet</code> is useful
 * for connecting to TCP sockets, and <code>socat</code> can be used to connect to both Unix and
 * TCP sockets.
 *
 * By starting a REPL from a Unix socket-based server instead of stdin, you can
 * connect to a long-running node process without restarting it.
 * @param {string} prompt
 * @param {string} source
 */
node.repl.start = function(prompt, source) {
  return node.repl.core_.start.apply(node.repl.core_, arguments);
};


/**
 * @private
 * @type {*}
 */
node.repl.core_ = require("repl");