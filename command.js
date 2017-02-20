#!/usr/bin/env node
var program = require("commander"),
	up = require("upath"),
	apploader = require("./index");

function resolveCredentials(options){
	var fs = require("fs"),
		opts = {};
	if(options.pfx)
		opts.pfx = fs.readFileSync(options.pfx);
	else{
		opts.key = fs.readFileSync(options.key);
		opts.cert = fs.readFileSync(options.cert);
	}
	return opts;
}

program
	.version("0.0.1")
	.option("-P, --properties [path]", "Properties file to configure the application", String, "./ees_properties.json")
	.parse(process.argv);

console.time("Application started");
var app = apploader(up.resolve(process.cwd(),program.properties)), 
	PROP = app.eesproperties.server;

if(PROP.http){
	console.log("Starting HTTP server");
	console.time("HTTP server started");
	require("http").createServer(app).listen(PROP.http.listen.port, PROP.http.listen.hostname, PROP.http.listen.backlog);
	console.timeEnd("HTTP server started");
}

if(PROP.https){
	console.log("Starting HTTPS server");
	console.time("HTTPS server started");
	require("https").createServer(resolveCredentials(PROP.https.options),app).listen(PROP.https.listen.port, PROP.https.listen.hostname, PROP.https.listen.backlog);
	console.timeEnd("HTTPS server started");
}

console.timeEnd("Application started");
