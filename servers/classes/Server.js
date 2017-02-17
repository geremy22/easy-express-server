
class Server {
    constructor(app,config) {
        this._config = config;
        this._server = null;
        this._app = app;
    }

    prepare(){}
    start(){}
}

module.exports = Server;