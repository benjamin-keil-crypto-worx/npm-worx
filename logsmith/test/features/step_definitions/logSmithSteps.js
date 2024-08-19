const { Given, When, Then } = require('@cucumber/cucumber');
const {assert} = require('chai');
const {testOptions} = require("../../resources/testOptions");
let {LogSmith} = require('../../../LogSmith');
let logger = null;

Given('A User create a new instance of a LogSmith logger with {string}', ( configKey ) =>{
   let options = testOptions[configKey]
   logger = LogSmith.initialize(options)   
});

Then('All Static fields should have the values as provided by {string} and the Date Format should be {string}', ( configKey, dateFormat ) =>{
    let options = testOptions[configKey]
    assert.equal(dateFormat, LogSmith.dateFormat);
    assert.equal(options.logToFile, LogSmith.logToFile);
    assert.equal(options.fileName, LogSmith.fileName);
    assert.equal(options.batchSize, LogSmith.batchSize);
    assert.equal(options.flushInterval, LogSmith.flushInterval);
});

Then('we log messages {int} times', ( times ) =>{
    for (let i = 0; i < times; i++ ){
        logger.info("test-log");
    }   
});

Then('the log queue should be clear after we waited {int} seconds', (waiTime) =>{
    setTimeout(()=>{
        assert.equal(LogSmith.logQueue, 0);
    }, waiTime)
});

Then('we log messages {int} times and have cleared the interval', function (times) {
    for (let i = 0; i < times; i++ ){
        logger.info("test-log");
    } 
    logger.clearLogInterval();  
});