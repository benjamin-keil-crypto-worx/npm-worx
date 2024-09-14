# simpleLog Intro

simpleLog is a lightweight, user-friendly logging utility designed to simplify the logging process for JavaScript and Node.js applications. Unlike other npm logging packages, simpleLog focuses on ease of use, reusability, and a streamlined _"create once, use everywhere"_ pattern. With simpleLog, there's no need for complex instantiation or configuration—just quick, intuitive logging that gets out of your way.

*Key features include:*

* Small and Lightweight: Minimal footprint with no unnecessary dependencies.
* Easy to Use: Simple setup and straightforward API, perfect for developers of all experience levels.
* Reusable: Design once, and reuse your logger configuration across your entire project.
* No Complex Instantiation: Say goodbye to cumbersome configuration; simpleLog gets you logging instantly.
* simpleLog is the perfect tool for developers seeking a hassle-free logging solution that just works.

## Quick Start

Getting Started is easy and quick !

install simpleLog 

```shell
$ npm install simple-log@latest
```

## Simple Logging Examples


Import The Library into project or app.
```js

/* Import simpleLog into your Application */
let {SimpleLog} = require("SimpleLog");

```


Create a options of configuration Object

```js

let options = {
        dateFormat:"",     // A Date Format Default is "yyyy-MM-dd"
        filePath:"",       // The File path where the log file file should be placed if logging to file is enabled 
        logLevel:"*",      // The Log Level Default is * (Supports All Levels). you can choose info|warn|error|debug
        logToFile: false,  // boolean flag to enable or disable logging to a file default is false
        fileName: null,    // Your desired log filename if logging to file is enabled Default is "simpleLog.yyyy-MM-dd.log"
        batchSize: 0,      // Log Queue Batch size (default is 0)  
        flushInterval: 0   // The Log Queue flush interval to clear and write logs from a log queue 
} 

```

Initialize the Logger

```js
let logger = SimpleLog.initialize(options) 
```


Log a Simple Info Message 

```js
logger.info("This is a Info Message");
```

Log a Warning Message

```js
logger.warn("This is a Warning Message");
```

Log A Error Message

```js
logger.error(new Error("I messed up Something"));
```

Log a Debug Message 

```js
logger.debug("This is a Debug Message, In some app.. What is going on? ");

```

Example Log Output:

```shell

# INFO Message 
2024-08-23 INFO (60103) "This is a Info Message"

# WARN Message
2024-08-23 WARN (60103) "This is a Warning Message"

# ERROR Message
2024-08-23 ERROR (60103)
["Error","I messed up Something","Error: I messed up Something\n    at Object.<anonymous> simpleLog/test/index.js:14:14)\n    at Module._compile (node:internal/modules/cjs/loader:1358:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:1416:10)\n    at Module.load (node:internal/modules/cjs/loader:1208:32)\n    at Module._load (node:internal/modules/cjs/loader:1024:12)\n    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:174:12)\n    at node:internal/main/run_main_module:28:49"]

# DEBUG Message
2024-08-23 DEBUG (60103) "This is a Debug Message, In some app.. What is going on? "

```

## Options

There are couple of options you can provide when you instantiate a simpleLog instance 

| name          | description                                                                                  |
| :------------ | :------------------------------------------------------------------------------------------- |
| dateFormat    | A Date Format Default is "yyyy-MM-dd"                                                        |
| filePath      | The File path where the log file file should be placed if logging to file is enabled         |
| logLevel      | The Log Level Default is * (Supports All Levels). you can choose info|warn|error|debug       |
| logToFile     | boolean flag to enable or disable logging to a file default is false                         |
| fileName      | Your desired log filename if logging to file is enabled Default is "simpleLog.yyyy-MM-dd.log" |
| batchSize     | Log Queue Batch size (default is 0)                                                          |
| flushInterval | The Log Queue flush interval to clear and write logs from a log queue                        |


## File Writes

Writing logs to file is a common use case with simpleLog it very easy to start logging your precious content to a file. 

whenever you instantiate or create a new simpleLog object make sure you set the `logToFile` alway to true if you
would like to log content to a given file.

simpleLog can either name the name file for you by using the default log file name `simpleLog.yyyy-MM-dd.log` or you van choose
another name by providing your custom file name to with  `fileName` parameter!

simpleLog provides 2 file Logging Strategies 

1. Write the Log immediately to file with every `info(), warn(), error(), debug()` invocation
2. Store Logs in a Log Queue with a predefined size allocated once it exceed the the predefined size `batchSize` the queue
   is Flushed and written to log file.
3. Flush the Queue at intervals `flushInterval` sometime its nice to not worry about anything if you provide a `flushInterval`
   _(A interval in milliseconds)_ simpleLog will periodically check the LogQueue and flush it writing all Queue content to the given file.


## Donations Welcome

<code><span style="color:black">Bitcoin  address: </span><span style="color:darkorange"> bc1qs6rvwnx0wlrqlncm90kk7mu0xs6980t85avfll</span></code>
<code><span style="color:blue">Ethereum address: </span><span style="color:darkorange"> 0x088667d218f5E5c4560cdcf21c4bd2b2377Df0C9</span></code>
