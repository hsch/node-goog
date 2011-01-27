var node_goog = {};
node_goog.goog = {};
node_goog.goog.init = function(opts) {};

node_goog.opts = {
  closureBasePath: {},
  additionalDeps: []
};
var exports;


var global;

var process;

/**
 * @type {Function}
 */
var require = function() {};

/**
 * @type {Function}
 */
require.resolve = function() {};

require.paths;

var __filename;

var __dirname;

var module;

var GLOBAL;

var root;

var console;

/**
 * @type {Function}
 */
var Buffer = function() {};

Buffer.prototype.poolSize;

/**
 * @type {Function}
 */
Buffer.prototype.isBuffer = function() {};

/**
 * @type {Function}
 */
Buffer.prototype.byteLength = function() {};

var encoding;

var extern_process = {};

extern_process.title;

extern_process.version;

extern_process.installPrefix;

extern_process.versions;

extern_process.platform;

extern_process.ARGV;

extern_process.argv;

extern_process.ENV;

extern_process.env;

extern_process.pid;

extern_process.execPath;

/**
 * @type {Function}
 */
extern_process.compile = function() {};

/**
 * @type {Function}
 */
extern_process.reallyExit = function() {};

/**
 * @type {Function}
 */
extern_process.chdir = function() {};

/**
 * @type {Function}
 */
extern_process.cwd = function() {};

/**
 * @type {Function}
 */
extern_process.getuid = function() {};

/**
 * @type {Function}
 */
extern_process.setuid = function() {};

/**
 * @type {Function}
 */
extern_process.setgid = function() {};

/**
 * @type {Function}
 */
extern_process.getgid = function() {};

/**
 * @type {Function}
 */
extern_process.umask = function() {};

/**
 * @type {Function}
 */
extern_process.dlopen = function() {};

/**
 * @type {Function}
 */
extern_process.memoryUsage = function() {};

/**
 * @type {Function}
 */
extern_process.binding = function() {};

/**
 * @type {Function}
 */
extern_process.EventEmitter = function() {};

/**
 * @type {Function}
 */
extern_process.debug = function() {};

/**
 * @type {Function}
 */
extern_process.error = function() {};

/**
 * @type {Function}
 */
extern_process.watchFile = function() {};

/**
 * @type {Function}
 */
extern_process.unwatchFile = function() {};

/**
 * @type {Function}
 */
extern_process.mixin = function() {};

/**
 * @type {Function}
 */
extern_process.createChildProcess = function() {};

/**
 * @type {Function}
 */
extern_process.inherits = function() {};

/**
 * @type {Function}
 */
extern_process.assert = function() {};

/**
 * @type {Function}
 */
extern_process.nextTick = function() {};

/**
 * @type {Function}
 */
extern_process.addListener = function() {};

/**
 * @type {Function}
 */
extern_process.on = function() {};

/**
 * @type {Function}
 */
extern_process.removeListener = function() {};

extern_process.stdout;

/**
 * @type {Function}
 */
extern_process.openStdin = function() {};

/**
 * @type {Function}
 */
extern_process.exit = function() {};

/**
 * @type {Function}
 */
extern_process.kill = function() {};

extern_process.mainModule;

/**
 * @type {Function}
 */
extern_process.emit = function() {};

/**
 * @type {Function}
 */
extern_process.once = function() {};

/**
 * @type {Function}
 */
extern_process.removeAllListeners = function() {};

/**
 * @type {Function}
 */
extern_process.listeners = function() {};

var extern_assert = {};

/**
 * @type {Function}
 */
extern_assert.AssertionError = function() {};

extern_assert.AssertionError.prototype.name;

extern_assert.AssertionError.prototype.message;

/**
 * @type {Function}
 */
extern_assert.AssertionError.prototype.captureStackTrace = function() {};

extern_assert.AssertionError.prototype.stackTraceLimit;

/**
 * @type {Function}
 */
extern_assert.fail = function() {};

/**
 * @type {Function}
 */
extern_assert.ok = function() {};

/**
 * @type {Function}
 */
extern_assert.equal = function() {};

/**
 * @type {Function}
 */
extern_assert.notEqual = function() {};

/**
 * @type {Function}
 */
extern_assert.deepEqual = function() {};

/**
 * @type {Function}
 */
extern_assert.notDeepEqual = function() {};

/**
 * @type {Function}
 */
extern_assert.strictEqual = function() {};

/**
 * @type {Function}
 */
extern_assert.notStrictEqual = function() {};

/**
 * @type {Function}
 */
extern_assert.doesNotThrow = function() {};

/**
 * @type {Function}
 */
extern_assert.ifError = function() {};

var extern_buffer = {};

/**
 * @type {Function}
 */
extern_buffer.SlowBuffer = function() {};

/**
 * @type {Function}
 */
extern_buffer.SlowBuffer.prototype.makeFastBuffer = function() {};

var extern_child_process = {};

/**
 * @type {Function}
 */
extern_child_process.spawn = function() {};

/**
 * @type {Function}
 */
extern_child_process.exec = function() {};

/**
 * @type {Function}
 */
extern_child_process.execFile = function() {};

var extern_constants = {};

extern_constants.EV_MINPRI;

extern_constants.EV_MAXPRI;

extern_constants.O_RDONLY;

extern_constants.O_WRONLY;

extern_constants.O_RDWR;

extern_constants.S_IFMT;

extern_constants.S_IFREG;

extern_constants.S_IFDIR;

extern_constants.S_IFCHR;

extern_constants.S_IFBLK;

extern_constants.S_IFIFO;

extern_constants.S_IFLNK;

extern_constants.S_IFSOCK;

extern_constants.O_CREAT;

extern_constants.O_EXCL;

extern_constants.O_NOCTTY;

extern_constants.O_TRUNC;

extern_constants.O_APPEND;

extern_constants.O_DIRECTORY;

extern_constants.O_NOFOLLOW;

extern_constants.O_SYNC;

extern_constants.S_IRWXU;

extern_constants.S_IRUSR;

extern_constants.S_IWUSR;

extern_constants.S_IXUSR;

extern_constants.S_IRWXG;

extern_constants.S_IRGRP;

extern_constants.S_IWGRP;

extern_constants.S_IXGRP;

extern_constants.S_IRWXO;

extern_constants.S_IROTH;

extern_constants.S_IWOTH;

extern_constants.S_IXOTH;

extern_constants.E2BIG;

extern_constants.EACCES;

extern_constants.EADDRINUSE;

extern_constants.EADDRNOTAVAIL;

extern_constants.EAFNOSUPPORT;

extern_constants.EAGAIN;

extern_constants.EALREADY;

extern_constants.EBADF;

extern_constants.EBADMSG;

extern_constants.EBUSY;

extern_constants.ECANCELED;

extern_constants.ECHILD;

extern_constants.ECONNABORTED;

extern_constants.ECONNREFUSED;

extern_constants.ECONNRESET;

extern_constants.EDEADLK;

extern_constants.EDESTADDRREQ;

extern_constants.EDOM;

extern_constants.EDQUOT;

extern_constants.EEXIST;

extern_constants.EFAULT;

extern_constants.EFBIG;

extern_constants.EHOSTUNREACH;

extern_constants.EIDRM;

extern_constants.EILSEQ;

extern_constants.EINPROGRESS;

extern_constants.EINTR;

extern_constants.EINVAL;

extern_constants.EIO;

extern_constants.EISCONN;

extern_constants.EISDIR;

extern_constants.ELOOP;

extern_constants.EMFILE;

extern_constants.EMLINK;

extern_constants.EMSGSIZE;

extern_constants.EMULTIHOP;

extern_constants.ENAMETOOLONG;

extern_constants.ENETDOWN;

extern_constants.ENETRESET;

extern_constants.ENETUNREACH;

extern_constants.ENFILE;

extern_constants.ENOBUFS;

extern_constants.ENODATA;

extern_constants.ENODEV;

extern_constants.ENOENT;

extern_constants.ENOEXEC;

extern_constants.ENOLCK;

extern_constants.ENOLINK;

extern_constants.ENOMEM;

extern_constants.ENOMSG;

extern_constants.ENOPROTOOPT;

extern_constants.ENOSPC;

extern_constants.ENOSR;

extern_constants.ENOSTR;

extern_constants.ENOSYS;

extern_constants.ENOTCONN;

extern_constants.ENOTDIR;

extern_constants.ENOTEMPTY;

extern_constants.ENOTSOCK;

extern_constants.ENOTSUP;

extern_constants.ENOTTY;

extern_constants.ENXIO;

extern_constants.EOPNOTSUPP;

extern_constants.EOVERFLOW;

extern_constants.EPERM;

extern_constants.EPIPE;

extern_constants.EPROTO;

extern_constants.EPROTONOSUPPORT;

extern_constants.EPROTOTYPE;

extern_constants.ERANGE;

extern_constants.EROFS;

extern_constants.ESPIPE;

extern_constants.ESRCH;

extern_constants.ESTALE;

extern_constants.ETIME;

extern_constants.ETIMEDOUT;

extern_constants.ETXTBSY;

extern_constants.EWOULDBLOCK;

extern_constants.EXDEV;

extern_constants.SIGHUP;

extern_constants.SIGINT;

extern_constants.SIGQUIT;

extern_constants.SIGILL;

extern_constants.SIGTRAP;

extern_constants.SIGABRT;

extern_constants.SIGBUS;

extern_constants.SIGFPE;

extern_constants.SIGKILL;

extern_constants.SIGUSR1;

extern_constants.SIGSEGV;

extern_constants.SIGUSR2;

extern_constants.SIGPIPE;

extern_constants.SIGALRM;

extern_constants.SIGTERM;

extern_constants.SIGCHLD;

extern_constants.SIGCONT;

extern_constants.SIGSTOP;

extern_constants.SIGTSTP;

extern_constants.SIGTTIN;

extern_constants.SIGTTOU;

extern_constants.SIGURG;

extern_constants.SIGXCPU;

extern_constants.SIGXFSZ;

extern_constants.SIGVTALRM;

extern_constants.SIGPROF;

extern_constants.SIGWINCH;

extern_constants.SIGIO;

extern_constants.SIGPOLL;

extern_constants.SIGLOST;

extern_constants.SIGPWR;

extern_constants.SIGSYS;

var extern_crypto = {};

/**
 * @type {Function}
 */
extern_crypto.createCredentials = function() {};

/**
 * @type {Function}
 */
extern_crypto.Credentials = function() {};

/**
 * @type {Function}
 */
extern_crypto.Hash = function() {};

/**
 * @type {Function}
 */
extern_crypto.createHash = function() {};

/**
 * @type {Function}
 */
extern_crypto.Hmac = function() {};

/**
 * @type {Function}
 */
extern_crypto.createHmac = function() {};

/**
 * @type {Function}
 */
extern_crypto.Cipher = function() {};

/**
 * @type {Function}
 */
extern_crypto.createCipher = function() {};

/**
 * @type {Function}
 */
extern_crypto.createCipheriv = function() {};

/**
 * @type {Function}
 */
extern_crypto.Decipher = function() {};

/**
 * @type {Function}
 */
extern_crypto.createDecipher = function() {};

/**
 * @type {Function}
 */
extern_crypto.createDecipheriv = function() {};

/**
 * @type {Function}
 */
extern_crypto.Sign = function() {};

/**
 * @type {Function}
 */
extern_crypto.createSign = function() {};

/**
 * @type {Function}
 */
extern_crypto.Verify = function() {};

/**
 * @type {Function}
 */
extern_crypto.createVerify = function() {};

extern_crypto.RootCaCerts;

/**
 * @type {Function}
 */
extern_crypto.createPair = function() {};

var extern_dgram = {};

/**
 * @type {Function}
 */
extern_dgram.Socket = function() {};

/**
 * @type {Function}
 */
extern_dgram.createSocket = function() {};

var extern_dns = {};

/**
 * @type {Function}
 */
extern_dns.resolve = function() {};

/**
 * @type {Function}
 */
extern_dns.getHostByName = function() {};

/**
 * @type {Function}
 */
extern_dns.getHostByAddr = function() {};

/**
 * @type {Function}
 */
extern_dns.lookup = function() {};

/**
 * @type {Function}
 */
extern_dns.resolve4 = function() {};

/**
 * @type {Function}
 */
extern_dns.resolve6 = function() {};

/**
 * @type {Function}
 */
extern_dns.resolveMx = function() {};

/**
 * @type {Function}
 */
extern_dns.resolveTxt = function() {};

/**
 * @type {Function}
 */
extern_dns.resolveSrv = function() {};

/**
 * @type {Function}
 */
extern_dns.reverse = function() {};

/**
 * @type {Function}
 */
extern_dns.resolveNs = function() {};

extern_dns.NODATA;

extern_dns.FORMERR;

extern_dns.BADRESP;

extern_dns.NOTFOUND;

extern_dns.BADNAME;

extern_dns.TIMEOUT;

extern_dns.CONNREFUSED;

extern_dns.NOMEM;

extern_dns.DESTRUCTION;

extern_dns.NOTIMP;

extern_dns.EREFUSED;

extern_dns.SERVFAIL;

var extern_events = {};

var extern_freelist = {};

/**
 * @type {Function}
 */
extern_freelist.FreeList = function() {};

var extern_fs = {};

/**
 * @type {Function}
 */
extern_fs.Stats = function() {};

/**
 * @type {Function}
 */
extern_fs.readFile = function() {};

/**
 * @type {Function}
 */
extern_fs.readFileSync = function() {};

/**
 * @type {Function}
 */
extern_fs.close = function() {};

/**
 * @type {Function}
 */
extern_fs.closeSync = function() {};

/**
 * @type {Function}
 */
extern_fs.open = function() {};

/**
 * @type {Function}
 */
extern_fs.openSync = function() {};

/**
 * @type {Function}
 */
extern_fs.read = function() {};

/**
 * @type {Function}
 */
extern_fs.readSync = function() {};

/**
 * @type {Function}
 */
extern_fs.write = function() {};

/**
 * @type {Function}
 */
extern_fs.writeSync = function() {};

/**
 * @type {Function}
 */
extern_fs.rename = function() {};

/**
 * @type {Function}
 */
extern_fs.renameSync = function() {};

/**
 * @type {Function}
 */
extern_fs.truncate = function() {};

/**
 * @type {Function}
 */
extern_fs.truncateSync = function() {};

/**
 * @type {Function}
 */
extern_fs.rmdir = function() {};

/**
 * @type {Function}
 */
extern_fs.rmdirSync = function() {};

/**
 * @type {Function}
 */
extern_fs.fdatasync = function() {};

/**
 * @type {Function}
 */
extern_fs.fdatasyncSync = function() {};

/**
 * @type {Function}
 */
extern_fs.fsync = function() {};

/**
 * @type {Function}
 */
extern_fs.fsyncSync = function() {};

/**
 * @type {Function}
 */
extern_fs.mkdir = function() {};

/**
 * @type {Function}
 */
extern_fs.mkdirSync = function() {};

/**
 * @type {Function}
 */
extern_fs.sendfile = function() {};

/**
 * @type {Function}
 */
extern_fs.sendfileSync = function() {};

/**
 * @type {Function}
 */
extern_fs.readdir = function() {};

/**
 * @type {Function}
 */
extern_fs.readdirSync = function() {};

/**
 * @type {Function}
 */
extern_fs.fstat = function() {};

/**
 * @type {Function}
 */
extern_fs.lstat = function() {};

/**
 * @type {Function}
 */
extern_fs.stat = function() {};

/**
 * @type {Function}
 */
extern_fs.fstatSync = function() {};

/**
 * @type {Function}
 */
extern_fs.lstatSync = function() {};

/**
 * @type {Function}
 */
extern_fs.statSync = function() {};

/**
 * @type {Function}
 */
extern_fs.readlink = function() {};

/**
 * @type {Function}
 */
extern_fs.readlinkSync = function() {};

/**
 * @type {Function}
 */
extern_fs.symlink = function() {};

/**
 * @type {Function}
 */
extern_fs.symlinkSync = function() {};

/**
 * @type {Function}
 */
extern_fs.link = function() {};

/**
 * @type {Function}
 */
extern_fs.linkSync = function() {};

/**
 * @type {Function}
 */
extern_fs.unlink = function() {};

/**
 * @type {Function}
 */
extern_fs.unlinkSync = function() {};

/**
 * @type {Function}
 */
extern_fs.chmod = function() {};

/**
 * @type {Function}
 */
extern_fs.chmodSync = function() {};

/**
 * @type {Function}
 */
extern_fs.chown = function() {};

/**
 * @type {Function}
 */
extern_fs.chownSync = function() {};

/**
 * @type {Function}
 */
extern_fs.writeFile = function() {};

/**
 * @type {Function}
 */
extern_fs.writeFileSync = function() {};

/**
 * @type {Function}
 */
extern_fs.realpathSync = function() {};

/**
 * @type {Function}
 */
extern_fs.realpath = function() {};

/**
 * @type {Function}
 */
extern_fs.createReadStream = function() {};

/**
 * @type {Function}
 */
extern_fs.ReadStream = function() {};

/**
 * @type {Function}
 */
extern_fs.FileReadStream = function() {};

/**
 * @type {Function}
 */
extern_fs.createWriteStream = function() {};

/**
 * @type {Function}
 */
extern_fs.WriteStream = function() {};

/**
 * @type {Function}
 */
extern_fs.FileWriteStream = function() {};

var extern_http = {};

extern_http.parsers;

extern_http.STATUS_CODES;

/**
 * @type {Function}
 */
extern_http.IncomingMessage = function() {};

/**
 * @type {Function}
 */
extern_http.OutgoingMessage = function() {};

/**
 * @type {Function}
 */
extern_http.ServerResponse = function() {};

/**
 * @type {Function}
 */
extern_http.ClientRequest = function() {};

/**
 * @type {Function}
 */
extern_http.Server = function() {};

/**
 * @type {Function}
 */
extern_http.createServer = function() {};

/**
 * @type {Function}
 */
extern_http.Client = function() {};

/**
 * @type {Function}
 */
extern_http.createClient = function() {};

/**
 * @type {Function}
 */
extern_http.cat = function() {};

var extern_net = {};

/**
 * @type {Function}
 */
extern_net.isIP = function() {};

/**
 * @type {Function}
 */
extern_net.isIPv4 = function() {};

/**
 * @type {Function}
 */
extern_net.isIPv6 = function() {};

/**
 * @type {Function}
 */
extern_net.Stream = function() {};

/**
 * @type {Function}
 */
extern_net.createConnection = function() {};

var extern_path = {};

/**
 * @type {Function}
 */
extern_path.join = function() {};

/**
 * @type {Function}
 */
extern_path.split = function() {};

/**
 * @type {Function}
 */
extern_path.normalizeArray = function() {};

/**
 * @type {Function}
 */
extern_path.normalize = function() {};

/**
 * @type {Function}
 */
extern_path.dirname = function() {};

/**
 * @type {Function}
 */
extern_path.basename = function() {};

/**
 * @type {Function}
 */
extern_path.extname = function() {};

/**
 * @type {Function}
 */
extern_path.exists = function() {};

/**
 * @type {Function}
 */
extern_path.existsSync = function() {};

var extern_querystring = {};

/**
 * @type {Function}
 */
extern_querystring.unescape = function() {};

/**
 * @type {Function}
 */
extern_querystring.escape = function() {};

/**
 * @type {Function}
 */
extern_querystring.encode = function() {};

/**
 * @type {Function}
 */
extern_querystring.stringify = function() {};

/**
 * @type {Function}
 */
extern_querystring.decode = function() {};

/**
 * @type {Function}
 */
extern_querystring.parse = function() {};

var extern_readline = {};

/**
 * @type {Function}
 */
extern_readline.createInterface = function() {};

/**
 * @type {Function}
 */
extern_readline.Interface = function() {};

var extern_repl = {};

/**
 * @type {Function}
 */
extern_repl.writer = function() {};

/**
 * @type {Function}
 */
extern_repl.REPLServer = function() {};

/**
 * @type {Function}
 */
extern_repl.start = function() {};

var extern_securepair = {};

/**
 * @type {Function}
 */
extern_securepair.createSecurePair = function() {};

var extern_stream = {};

var extern_string_decoder = {};

/**
 * @type {Function}
 */
extern_string_decoder.StringDecoder = function() {};

var extern_sys = {};

/**
 * @type {Function}
 */
extern_sys.print = function() {};

/**
 * @type {Function}
 */
extern_sys.puts = function() {};

/**
 * @type {Function}
 */
extern_sys.inspect = function() {};

/**
 * @type {Function}
 */
extern_sys.p = function() {};

/**
 * @type {Function}
 */
extern_sys.log = function() {};

/**
 * @type {Function}
 */
extern_sys.pump = function() {};

var extern_timers = {};

/**
 * @type {Function}
 */
extern_timers.unenroll = function() {};

/**
 * @type {Function}
 */
extern_timers.enroll = function() {};

/**
 * @type {Function}
 */
extern_timers.active = function() {};

var extern_url = {};

/**
 * @type {Function}
 */
extern_url.resolveObject = function() {};

/**
 * @type {Function}
 */
extern_url.format = function() {};

var extern_util = {};

var extern_vm = {};

/**
 * @type {Function}
 */
extern_vm.Script = function() {};

/**
 * @type {Function}
 */
extern_vm.Script.prototype.createContext = function() {};

/**
 * @type {Function}
 */
extern_vm.Script.prototype.runInContext = function() {};

/**
 * @type {Function}
 */
extern_vm.Script.prototype.runInThisContext = function() {};

/**
 * @type {Function}
 */
extern_vm.Script.prototype.runInNewContext = function() {};

/**
 * @type {Function}
 */
extern_vm.createScript = function() {};