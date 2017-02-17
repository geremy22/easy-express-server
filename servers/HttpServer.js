const http = require("http"),
    Server = require("./classes/Server");

class HttpServer extends Server{
    constructor(app,config) {
        super(app,config);
    }

    prepare() {
        this._server = http.createServer(this._app);
    }

    start() {
        const {port,hostname,backlog} = config.listen;
        this._server.listen(port, hostname, backlog);
    }
}

module.exports = HttpServer;