const https = require("https"),
    fs = require("fs"),
    Server = require("./classes/Server");

class HttpsServer extends Server {
    constructor(app,config) {
        super(app,config);
    }

    _resolveCredentials() {
        const opts = {}, options = this._config.options;
        if(options.pfx)
            opts.pfx = fs.readFileSync(options.pfx);
        else{
            opts.key = fs.readFileSync(options.key);
            opts.cert = fs.readFileSync(options.cert);
        }
        return opts;
    }

    prepare() {
        this._server = https.createServer(this._resolveCredentials(),this._app);
    }

    start() {
        const {port,hostname,backlog} = config.listen;
        this._server.listen(port, hostname, backlog);
    }
}

module.exports = HttpsServer;