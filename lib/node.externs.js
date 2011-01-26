var node_goog = {};
node_goog.goog = {};
node_goog.goog.init = function(opts) {};

node_goog.opts = {
  closureBasePath: {},
  additionalDeps: []
};


var process = {};

process.title;

process.version;

process.installPrefix;

process.versions;

process.platform;

process.ARGV;

process.argv;

process.ENV;

process.env;

process.pid;

process.execPath;

process.compile = function() {};

process.reallyExit = function() {};

process.chdir = function() {};

process.cwd = function() {};

process.getuid = function() {};

process.setuid = function() {};

process.setgid = function() {};

process.getgid = function() {};

process.umask = function() {};

process.dlopen = function() {};

process.memoryUsage = function() {};

process.binding = function() {};

process.EventEmitter = function() {};

process.debug = function() {};

process.error = function() {};

process.watchFile = function() {};

process.unwatchFile = function() {};

process.mixin = function() {};

process.createChildProcess = function() {};

process.inherits = function() {};

process.assert = function() {};

process.nextTick = function() {};

process.addListener = function() {};

process.on = function() {};

process.removeListener = function() {};

process.stdout;

process.openStdin = function() {};

process.exit = function() {};

process.kill = function() {};

process.mainModule;

process.emit = function() {};

process.once = function() {};

process.removeAllListeners = function() {};

process.listeners = function() {};

var assert = {};

assert.AssertionError = function() {};

assert.AssertionError.prototype.name;

assert.AssertionError.prototype.message;

assert.fail = function() {};

assert.ok = function() {};

assert.equal = function() {};

assert.notEqual = function() {};

assert.deepEqual = function() {};

assert.notDeepEqual = function() {};

assert.strictEqual = function() {};

assert.notStrictEqual = function() {};

assert.doesNotThrow = function() {};

assert.ifError = function() {};

var buffer = {};

buffer.SlowBuffer = function() {};

buffer.SlowBuffer.prototype.byteLength = function() {};

buffer.SlowBuffer.prototype.makeFastBuffer = function() {};

buffer.Buffer = function() {};

buffer.Buffer.prototype.poolSize;

buffer.Buffer.prototype.isBuffer = function() {};

buffer.Buffer.prototype.byteLength = function() {};

var child_process = {};

child_process.spawn = function() {};

child_process.exec = function() {};

child_process.execFile = function() {};

var constants = {};

constants.EV_MINPRI;

constants.EV_MAXPRI;

constants.O_RDONLY;

constants.O_WRONLY;

constants.O_RDWR;

constants.S_IFMT;

constants.S_IFREG;

constants.S_IFDIR;

constants.S_IFCHR;

constants.S_IFBLK;

constants.S_IFIFO;

constants.S_IFLNK;

constants.S_IFSOCK;

constants.O_CREAT;

constants.O_EXCL;

constants.O_NOCTTY;

constants.O_TRUNC;

constants.O_APPEND;

constants.O_DIRECTORY;

constants.O_NOFOLLOW;

constants.O_SYNC;

constants.S_IRWXU;

constants.S_IRUSR;

constants.S_IWUSR;

constants.S_IXUSR;

constants.S_IRWXG;

constants.S_IRGRP;

constants.S_IWGRP;

constants.S_IXGRP;

constants.S_IRWXO;

constants.S_IROTH;

constants.S_IWOTH;

constants.S_IXOTH;

constants.E2BIG;

constants.EACCES;

constants.EADDRINUSE;

constants.EADDRNOTAVAIL;

constants.EAFNOSUPPORT;

constants.EAGAIN;

constants.EALREADY;

constants.EBADF;

constants.EBADMSG;

constants.EBUSY;

constants.ECANCELED;

constants.ECHILD;

constants.ECONNABORTED;

constants.ECONNREFUSED;

constants.ECONNRESET;

constants.EDEADLK;

constants.EDESTADDRREQ;

constants.EDOM;

constants.EDQUOT;

constants.EEXIST;

constants.EFAULT;

constants.EFBIG;

constants.EHOSTUNREACH;

constants.EIDRM;

constants.EILSEQ;

constants.EINPROGRESS;

constants.EINTR;

constants.EINVAL;

constants.EIO;

constants.EISCONN;

constants.EISDIR;

constants.ELOOP;

constants.EMFILE;

constants.EMLINK;

constants.EMSGSIZE;

constants.EMULTIHOP;

constants.ENAMETOOLONG;

constants.ENETDOWN;

constants.ENETRESET;

constants.ENETUNREACH;

constants.ENFILE;

constants.ENOBUFS;

constants.ENODATA;

constants.ENODEV;

constants.ENOENT;

constants.ENOEXEC;

constants.ENOLCK;

constants.ENOLINK;

constants.ENOMEM;

constants.ENOMSG;

constants.ENOPROTOOPT;

constants.ENOSPC;

constants.ENOSR;

constants.ENOSTR;

constants.ENOSYS;

constants.ENOTCONN;

constants.ENOTDIR;

constants.ENOTEMPTY;

constants.ENOTSOCK;

constants.ENOTSUP;

constants.ENOTTY;

constants.ENXIO;

constants.EOPNOTSUPP;

constants.EOVERFLOW;

constants.EPERM;

constants.EPIPE;

constants.EPROTO;

constants.EPROTONOSUPPORT;

constants.EPROTOTYPE;

constants.ERANGE;

constants.EROFS;

constants.ESPIPE;

constants.ESRCH;

constants.ESTALE;

constants.ETIME;

constants.ETIMEDOUT;

constants.ETXTBSY;

constants.EWOULDBLOCK;

constants.EXDEV;

constants.SIGHUP;

constants.SIGINT;

constants.SIGQUIT;

constants.SIGILL;

constants.SIGTRAP;

constants.SIGABRT;

constants.SIGBUS;

constants.SIGFPE;

constants.SIGKILL;

constants.SIGUSR1;

constants.SIGSEGV;

constants.SIGUSR2;

constants.SIGPIPE;

constants.SIGALRM;

constants.SIGTERM;

constants.SIGCHLD;

constants.SIGCONT;

constants.SIGSTOP;

constants.SIGTSTP;

constants.SIGTTIN;

constants.SIGTTOU;

constants.SIGURG;

constants.SIGXCPU;

constants.SIGXFSZ;

constants.SIGVTALRM;

constants.SIGPROF;

constants.SIGWINCH;

constants.SIGIO;

constants.SIGPOLL;

constants.SIGLOST;

constants.SIGPWR;

constants.SIGSYS;

var crypto = {};

crypto.createCredentials = function() {};

crypto.Credentials = function() {};

crypto.Hash = function() {};

crypto.createHash = function() {};

crypto.Hmac = function() {};

crypto.createHmac = function() {};

crypto.Cipher = function() {};

crypto.createCipher = function() {};

crypto.createCipheriv = function() {};

crypto.Decipher = function() {};

crypto.createDecipher = function() {};

crypto.createDecipheriv = function() {};

crypto.Sign = function() {};

crypto.createSign = function() {};

crypto.Verify = function() {};

crypto.createVerify = function() {};

crypto.RootCaCerts;

crypto.createPair = function() {};

var dgram = {};

dgram.Socket = function() {};

dgram.createSocket = function() {};

var dns = {};

dns.resolve = function() {};

dns.getHostByName = function() {};

dns.getHostByAddr = function() {};

dns.lookup = function() {};

dns.resolve4 = function() {};

dns.resolve6 = function() {};

dns.resolveMx = function() {};

dns.resolveTxt = function() {};

dns.resolveSrv = function() {};

dns.reverse = function() {};

dns.resolveNs = function() {};

dns.NODATA;

dns.FORMERR;

dns.BADRESP;

dns.NOTFOUND;

dns.BADNAME;

dns.TIMEOUT;

dns.CONNREFUSED;

dns.NOMEM;

dns.DESTRUCTION;

dns.NOTIMP;

dns.EREFUSED;

dns.SERVFAIL;

var events = {};

events.EventEmitter = function() {};

var freelist = {};

freelist.FreeList = function() {};

var fs = {};

fs.Stats = function() {};

fs.readFile = function() {};

fs.readFileSync = function() {};

fs.close = function() {};

fs.closeSync = function() {};

fs.open = function() {};

fs.openSync = function() {};

fs.read = function() {};

fs.readSync = function() {};

fs.write = function() {};

fs.writeSync = function() {};

fs.rename = function() {};

fs.renameSync = function() {};

fs.truncate = function() {};

fs.truncateSync = function() {};

fs.rmdir = function() {};

fs.rmdirSync = function() {};

fs.fdatasync = function() {};

fs.fdatasyncSync = function() {};

fs.fsync = function() {};

fs.fsyncSync = function() {};

fs.mkdir = function() {};

fs.mkdirSync = function() {};

fs.sendfile = function() {};

fs.sendfileSync = function() {};

fs.readdir = function() {};

fs.readdirSync = function() {};

fs.fstat = function() {};

fs.lstat = function() {};

fs.stat = function() {};

fs.fstatSync = function() {};

fs.lstatSync = function() {};

fs.statSync = function() {};

fs.readlink = function() {};

fs.readlinkSync = function() {};

fs.symlink = function() {};

fs.symlinkSync = function() {};

fs.link = function() {};

fs.linkSync = function() {};

fs.unlink = function() {};

fs.unlinkSync = function() {};

fs.chmod = function() {};

fs.chmodSync = function() {};

fs.chown = function() {};

fs.chownSync = function() {};

fs.writeFile = function() {};

fs.writeFileSync = function() {};

fs.watchFile = function() {};

fs.unwatchFile = function() {};

fs.realpathSync = function() {};

fs.realpath = function() {};

fs.createReadStream = function() {};

fs.ReadStream = function() {};

fs.FileReadStream = function() {};

fs.createWriteStream = function() {};

fs.WriteStream = function() {};

fs.FileWriteStream = function() {};

var http = {};

http.parsers;

http.STATUS_CODES;

http.IncomingMessage = function() {};

http.OutgoingMessage = function() {};

http.ServerResponse = function() {};

http.ClientRequest = function() {};

http.Server = function() {};

http.createServer = function() {};

http.Client = function() {};

http.createClient = function() {};

http.cat = function() {};

var net = {};

net.isIP = function() {};

net.isIPv4 = function() {};

net.isIPv6 = function() {};

net.Stream = function() {};

net.createConnection = function() {};

net.Server = function() {};

net.createServer = function() {};

var path = {};

path.join = function() {};

path.split = function() {};

path.normalizeArray = function() {};

path.normalize = function() {};

path.dirname = function() {};

path.basename = function() {};

path.extname = function() {};

path.exists = function() {};

path.existsSync = function() {};

var querystring = {};

querystring.unescape = function() {};

querystring.escape = function() {};

querystring.encode = function() {};

querystring.stringify = function() {};

querystring.decode = function() {};

querystring.parse = function() {};

var readline = {};

readline.createInterface = function() {};

readline.Interface = function() {};

var repl = {};

repl.writer = function() {};

repl.REPLServer = function() {};

repl.start = function() {};

var stream = {};

stream.Stream = function() {};

var string_decoder = {};

string_decoder.StringDecoder = function() {};

var sys = {};

sys.print = function() {};

sys.puts = function() {};

sys.debug = function() {};

sys.error = function() {};

sys.inspect = function() {};

sys.p = function() {};

sys.log = function() {};

sys.exec = function() {};

sys.pump = function() {};

sys.inherits = function() {};

var timers = {};

timers.unenroll = function() {};

timers.enroll = function() {};

timers.active = function() {};

timers.setTimeout = function() {};

timers.clearTimeout = function() {};

timers.setInterval = function() {};

timers.clearInterval = function() {};

var url = {};

url.parse = function() {};

url.resolve = function() {};

url.resolveObject = function() {};

url.format = function() {};

var util = {};

util.print = function() {};

util.puts = function() {};

util.debug = function() {};

util.error = function() {};

util.inspect = function() {};

util.p = function() {};

util.log = function() {};

util.exec = function() {};

util.pump = function() {};

util.inherits = function() {};

var vm = {};

vm.Script = function() {};

vm.Script.prototype.createContext = function() {};

vm.Script.prototype.runInContext = function() {};

vm.Script.prototype.runInThisContext = function() {};

vm.Script.prototype.runInNewContext = function() {};

vm.createScript = function() {};

vm.createContext = function() {};

vm.runInContext = function() {};

vm.runInThisContext = function() {};

vm.runInNewContext = function() {};