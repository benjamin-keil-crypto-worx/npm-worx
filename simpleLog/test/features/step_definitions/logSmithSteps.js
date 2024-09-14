const { Given, When, Then } = require('@cucumber/cucumber');
const {assert} = require('chai');
const {testOptions} = require("../../resources/testOptions");
let {SimpleLog} = require('../../../SimpleLog');
let logger = null;

Given('A User create a new instance of a SimpleLog logger with {string}', ( configKey ) =>{
   let options = testOptions[configKey]
   logger = SimpleLog.initialize(options)   
});

Then('All Static fields should have the values as provided by {string} and the Date Format should be {string}', ( configKey, dateFormat ) =>{
    let options = testOptions[configKey]
    assert.equal(dateFormat, SimpleLog.dateFormat);
    assert.equal(options.logToFile, SimpleLog.logToFile);
    assert.equal(options.fileName, SimpleLog.fileName);
    assert.equal(options.batchSize, SimpleLog.batchSize);
    assert.equal(options.flushInterval, SimpleLog.flushInterval);
});

Then('we log messages {int} times', ( times ) =>{
    for (let i = 0; i < times; i++ ){
        logger.info("test-log");
    }   
});

Then('the log queue should be clear after we waited {int} seconds', (waiTime) =>{
    setTimeout(()=>{
        assert.equal(SimpleLog.logQueue, 0);
    }, waiTime)
});

Then('we log messages {int} times and have cleared the interval', function (times) {
    for (let i = 0; i < times; i++ ){
        logger.info("test-log");
    } 
    logger.clearLogInterval();  
});