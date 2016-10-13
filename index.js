var express = require("express"),
	expressWs = require("express-ws"),
	moduleLoader = require("easy-module-loader"),
	up = require("upath"),
	fs = require("fs");

function jsonRequirer(propertiesPath){
	return JSON.parse(fs.readFileSync(up.resolve(propertiesPath), {encoding: "UTF-8"}));
}

function applySettings(app,settings){
	if(!settings)return;
	console.log("Applying settings...");
	Object.keys(settings).forEach((k)=>{
		app.set(k,settings[k]);
	});
}

function resolvePriority(priority){
	return Number.isFinite(priority) ? (priority >= 0 ? "a" + priority : "c" + priority * -1) : "b";
}

function applyLoaders(app,loader,loadersSettings){
	if(!loadersSettings)return;
	console.log("Applying loaders...");
	loadersSettings.forEach((loadSetting)=>{
		var method = loader[loadSetting.method.toLowerCase()];
		if(!method)return;

		moduleLoader({
			filter: new RegExp(loadSetting.filter), 
			depth: loadSetting.depth,
			requirer: method.requirer
		})
		.getModules(up.resolve(app.eesproperties.main,loadSetting.main))
		.sort((b,a)=>resolvePriority(b.module._PRIORITY) > resolvePriority(a.module._PRIORITY))
		.forEach((mod)=>{
			method.resolve(mod,loadSetting);
		});
	});
}

function load(propertiesPath){
	var app = express(),
		PROPS = app.eesproperties = jsonRequirer(propertiesPath);
		PROPS.main = PROPS.main ? up.resolve(up.dirname(propertiesPath), PROPS.main) : up.dirname(propertiesPath);

	console.log("Starting express application: " + PROPS.app);

	applySettings(app,PROPS.settings);

	if(PROPS.ws)
		app.wsInstance = expressWs(app,null,{wsOptions: PROPS.ws, leaveRouterUntouched: PROPS.ws.leaveRouterUntouched});

	applyLoaders(app,new LoadersProxy(app, Boolean(PROPS.ws)),PROPS.loaders);

	if(PROPS.static && PROPS.static.main){
		console.log("Starting static service...");
		app.use(express.static(up.resolve(PROPS.main, PROPS.static.main), PROPS.static.settings));
	}
	console.log("Application ready");
	return app;
}

//Available loaders proxy
function LoadersProxy(app, enableWS){
	function wrapValidResolver(fun){
		return (modata, loadSetting)=>{
			if(!modata.module)return;
			process.stdout.write("Registering ["+loadSetting.method.toUpperCase()+"]: Path: '"+modata.path+"' Module: ["+modata.name+"]... ");
			fun(modata, loadSetting);
			console.log("OK!");
		}
	}

	function basicProxyFor(fun){
		return {
			resolve: wrapValidResolver((modata,loadSetting)=>{
				var args = [], module = Array.isArray(modata.module) ? modata.module : [modata.module];
				if(loadSetting.dirouting)
					args.push(modata.path);
				module.forEach((m)=>args.push(m));
				fun.apply(app, args);
			})
		}
	}

	this.config = {
		resolve: wrapValidResolver((modata, loadSetting)=>{
			modata.module(app);
		})
	}
	this.locals = {
		resolve: wrapValidResolver((modata, loadSetting)=>{
			Object.keys(modata.module).forEach((k)=>{
				app.locals[k] = modata.module[k];
			})
		}),
		requirer: jsonRequirer
	}

	this.all = 	basicProxyFor(app.all);
	this.delete = basicProxyFor(app.delete);
	this.engine = basicProxyFor(app.engine);
	this.get = basicProxyFor(app.get);
	this.post = basicProxyFor(app.post);
	this.put = basicProxyFor(app.put);
	this.render = basicProxyFor(app.render);
	this.use = basicProxyFor(app.use);
	if(enableWS)
		this.ws = basicProxyFor(app.ws);
}

module.exports = load;