let {LogSmith} = require("../LogSmith");

let logger = LogSmith.initialize({
    dateFormat:"yyyy-MM-dd",
    filePath:__dirname,
    logLevel:"*",
    logToFile: true,
    fileName: 'test.log',
    batchSize: 10,
    flushInterval: 5000
});

logger.info("Test Logging")