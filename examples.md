###Examples
####Simple static server
/home/dev/test/static/index.html<br/>
/home/dev/test/ees_properties.json
```
{
  "app": "MyTestApp",
  "server": {
    "http": {
      "listen": {
        "port": 8080
      }
    }
  },
  "static": {
    "main" : "./static"
  }
}
```
Server init output:
```
/home/dev/test/: ees
Starting express application: MyTestApp
Starting static service...
Application ready
Starting HTTP server
HTTP server started: 9.851ms
Application started: 21.337ms
```
####Http application
/home/dev/test/www/index.js
```
module.exports = (req,res)=>{
  res.send("index!!");
}
```
/home/dev/test/www/login/login.js
```
module.exports = (req,res)=>{
  res.send("login!!");
}
```
/home/dev/test/www/content/content.js
```
module.exports = (req,res)=>{
  res.send("content!!");
}
```
/home/dev/test/ees_properties.json
```
{
  "app": "MyTestApp",
  "server": {
    "http": {
      "listen": {
        "port": 8080
      }
    }
  },
  "loaders": [
    {"method": "get", "main":"./www", "dirouting": true}
  ]
}
```
Server init output:
```
/home/dev/test/: ees
Starting express application: MyTestApp
Applying loaders...
Registering [GET]: Path: '/content' Module: [content]... OK!
Registering [GET]: Path: '/' Module: [index]... OK!
Registering [GET]: Path: '/login' Module: [login]... OK!
Application ready
Starting HTTP server
HTTP server started: 10.257ms
Application started: 50.468ms
```
In the browser:
http://localhost:8080/ => index!!<br/>
http://localhost:8080/login => login!!<br/>
http://localhost:8080/content => content!!

####Https application
/home/dev/test/ees_properties.json<br/>
/home/dev/test/www/index.js<br/>
/home/dev/test/www/login/login.js<br/>
/home/dev/test/www/content/content.js<br/>
/home/dev/test/ssl/server.key<br/>
/home/dev/test/ssl/server.crt
```
{
  "app": "MyTestApp",
  "server": {
    "https": {
      "listen": {
        "port": 8443
      },
      "options": {
        "key": "./ssl/server.key",
        "cert": "./ssl/server.crt"
      }
    }
  },
  "loaders": [
    {"method": "get", "main":"./www", "dirouting": true}
  ]
}
```
Server init output:
```
/home/dev/test/: ees
Starting express application: MyTestApp
Applying loaders...
Registering [GET]: Path: '/content' Module: [content]... OK!
Registering [GET]: Path: '/' Module: [index]... OK!
Registering [GET]: Path: '/login' Module: [login]... OK!
Application ready
Starting HTTP server
HTTPS server started: 25.300ms
Application started: 67.076ms
```
####File name based loaders
Note the change in the file names and the filters in the loaders.<br/>
/home/dev/test/ees_properties.json<br/>
/home/dev/test/www/index.get.js<br/>
/home/dev/test/www/login/login.get.js<br/>
/home/dev/test/www/content/content.post.js<br/>
/home/dev/test/www/ignoreme/ignoreme.js
```
{
  "app": "MyTestApp",
  "server": {
    "http": {
      "listen": {
        "port": 8080
      }
    }
  },
  "loaders": [
    {"method": "get", "main":"./www", "filter":".*\\.get.js$", "dirouting": true},
    {"method": "post", "main":"./www", "filter":".*\\.post.js$", "dirouting": true}
  ]
}
```
Server init output:
```
/home/dev/test/: ees
Starting express application: MyTestApp
Applying loaders...
Registering [GET]: Path: '/' Module: [index.get]... OK!
Registering [GET]: Path: '/login' Module: [login.get]... OK!
Registering [POST]: Path: '/content' Module: [content.post]... OK!
Application ready
Starting HTTP server
HTTP server started: 10.294ms
Application started: 49.652ms
```
