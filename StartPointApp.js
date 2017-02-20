const Express = require("express"),
    up = require("upath");
class StartPointApp {
    constructor(properties={}){
        this._app = new Express();
        this._properties = properties;
        this._properties.main = this._properties.main || process.cwd();
        this._servers = [];
    }

    _applySettings(){
        const {settings} = this._properties;
        if(!settings)return;

        Object.keys(settings).forEach((k)=>{
            this._app.set(k,settings[k]);
        });
    }

    load(){

    }
}

exports.StartPointApp = StartPointApp;