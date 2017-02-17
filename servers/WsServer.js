const Server = require("./classes/Server"),
    ExpressWS = require("express-ws");

class WsServer extends Server{
    constructor(app,config) {
        super(app,config);
    }

    prepare() {
        this._app.wsInstance = ExpressWS(this._app,null,{
            wsOptions: this._config.ws,
            leaveRouterUntouched: this._config.ws.leaveRouterUntouched});
    }
}

module.exports = StaticServer;
