let {SimpleLog} = require("../SimpleLog");

let logger = SimpleLog.initialize({
    dateFormat:"yyyy-MM-dd",
    filePath:__dirname,
    logLevel:"*",
    logToFile: true,
    fileName: 'test.log',
    batchSize: 10,
    flushInterval: 5000
});
logger.info("This is a Info Message");
logger.warn("This is a Warning Message");
logger.error(new Error("I messed up Something"));
logger.debug("This is a Debug Message, In some app.. What is going on? ");