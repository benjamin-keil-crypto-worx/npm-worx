module.exports.testOptions = {
    logAllNoFileWrite: {
        dateFormat:"",
        filePath:"",
        logLevel:"*",
        logToFile: false,
        fileName: null,
        batchSize: 0,
        flushInterval: 0
    },logDebugNoFileWrite: {
        dateFormat:"",
        filePath:"",
        logLevel:"debug",
        logToFile: false,
        fileName: null,
        batchSize: 0,
        flushInterval: 0
    },logInfoNoFileWrite: {
        dateFormat:"",
        filePath:"",
        logLevel:"info",
        logToFile: false,
        fileName: null,
        batchSize: 0,
        flushInterval: 0
    },logWarnNoFileWrite: {
        dateFormat:"",
        filePath:"",
        logLevel:"warn",
        logToFile: false,
        fileName: null,
        batchSize: 0,
        flushInterval: 0
    },logErrorNoFileWrite: {
        dateFormat:"",
        filePath:"",
        logLevel:"error",
        logToFile: false,
        fileName: null,
        batchSize: 0,
        flushInterval: 0
    },logAllWithFileWrite: {
        dateFormat:"yyyy-MM-dd",
        filePath:"/tmp/test-dir",
        logLevel:"*",
        logToFile: true,
        fileName: 'test.log',
        batchSize: 0,
        flushInterval: 0
    },logAllWithFileWriteAndFlushSize: {
        dateFormat:"yyyy-MM-dd",
        filePath:"/tmp/test-dir",
        logLevel:"*",
        logToFile: true,
        fileName: 'test.log',
        batchSize: 6,
        flushInterval: 0
    },logAllWithFileWriteAndFlushInterval: {
        dateFormat:"yyyy-MM-dd",
        filePath:"/tmp/test-dir",
        logLevel:"*",
        logToFile: true,
        fileName: 'test.log',
        batchSize: 200,
        flushInterval: 5000
    }
} 