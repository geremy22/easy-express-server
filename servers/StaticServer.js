const Server = require("./classes/Server"),
    Express = require("express"),
    up = require("upath");

class StaticServer extends Server{
    constructor(app,config) {
        super(app,config);
    }

    prepare() {
        const {main,settings} = this._config, mainApp = this._app._main;
        this._app.use(Express.static(up.resolve(mainApp, main), settings));
    }
}

module.exports = StaticServer;