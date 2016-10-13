Easy expressjs predefined and configurable server.

###Install
`npm -g install ees`

###Usage
EES is a CLI tool for prepare and start an expressjs aplication based on a json properties file.

`ees -P ./propertiesFile.json`

If you don't pass -P option, EES will attepmt to use 'ees_properties.json' from the current dir.

###Properties
* <b>app</b>: A single name for the app.
* <b>main</b>: Main path from where all other paths will be relative to. By default, the current dir.
* <b>server</b>: An object with two availables properties: `http` and `https`. 
  * <b>http</b>: An object with a `listen` propertie in which you can define `port`,`hostname` and `backlog` that configures an http server for the expressjs app.
  * <b>https</b>: An object with a `listen` propertie such as http. Also you can define https `options`:
    * <b>key</b>: Path to the certificate key.
    * <b>cert</b>: Path to the certificate.
    * <b>pfx</b>: Path to the pfx file. If you define this file, key and cert will be ignored.
* <b>static</b>: An object to configure the static service. You must define the `main` path for the static files. Also you can define static `settings` ([See express documentation](http://expressjs.com/en/4x/api.html#express.static)).
* <b>loaders</b>: Array of loaders configuration. Each middleware function will be loaded by requiring all module files who match each configuration.
  * <b>main</b>: The main path in wich the loader searches for modules. Also, this is the "root" path for these modules.
  * <b>method</b>: Method name that will be used to load each middleware function. All available methods are:
  * <b>config</b>: All modules loaded with config method must be a function that receives the expressjs application. Use this method if you want to add specific configuration programatically.
    * <b>locals</b>: All modules loaded with locals method must be a json file. Each propertie of json file will be set to `app.locals` object.
    * <b>express functions</b>: All modules loaded with the following methods must export the middleware function or an array of middleware functions. If `dirouting` is set to false, you must allways exports an array in wich the first index should be the endpoint route. Supported functions are:
      * <b>all</b>
      * <b>delete</b>
      * <b>engine</b>
      * <b>get</b>
      * <b>post</b>
      * <b>put</b>
      * <b>render</b>
      * <b>use</b>
      * <b>ws</b> (If websockets are enabled)
  * <b>filter</b>: A regular expression used to filter each file that will be required.For more info [see EML documentation](https://github.com/geremy22/easy-module-loader#usage).
  * <b>depth</b>: Number indicating how deep in the main path you want to load. For more info [see EML documentation](https://github.com/geremy22/easy-module-loader#usage).
  * <b>dirouting</b>: Set to true if you want to register each endpoint relative to the `main` path. By default, false. <br/>
Then, if you main path is "/home/dev/api":<br/>
/home/dev/api/index.js -> this module will be loaded in "/" endpoint, because for the loader "/home/dev/api" is te root.<br/>
/home/dev/api/login/login.js -> this module will be loaded in "/login" endpoint.<br/>
/home/dev/api/content/content.js -> this module will be loaded in "/content" endpoint and so on...
* <b>ws</b>: Options object passed to WebSocketServer constructor. See [express-ws](https://www.npmjs.com/package/express-ws#expresswsapp-server-options). The websocket instance will be stored in `app.wsInstance`.

See [examples!!](https://github.com/geremy22/easy-express-server/blob/master/examples.md)