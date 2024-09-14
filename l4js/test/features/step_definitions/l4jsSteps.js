const { Given, When, Then } = require('@cucumber/cucumber');
const {assert} = require('chai');
const {testOptions} = require("../../resources/testOptions");
let {L4js} = require('../../../l4js');
let logger = null;

Given('A User create a new instance of a L4js logger with {string}', ( configKey ) =>{
   let options = testOptions[configKey]
   logger = L4js.initialize(options)   
});

Then('All Static fields should have the values as provided by {string} and the Date Format should be {string}', ( configKey, dateFormat ) =>{
    let options = testOptions[configKey]
    assert.equal(dateFormat, L4js.dateFormat);
    assert.equal(options.logToFile, L4js.logToFile);
    assert.equal(options.fileName, L4js.fileName);
    assert.equal(options.batchSize, L4js.batchSize);
    assert.equal(options.flushInterval, L4js.flushInterval);
});

Then('we log messages {int} times', ( times ) =>{
    for (let i = 0; i < times; i++ ){
        logger.info("test-log");
    }   
});

Then('the log queue should be clear after we waited {int} seconds', (waiTime) =>{
    setTimeout(()=>{
        assert.equal(L4js.logQueue, 0);
    }, waiTime)
});

Then('we log messages {int} times and have cleared the interval', function (times) {
    for (let i = 0; i < times; i++ ){
        logger.info("test-log");
    } 
    logger.clearLogInterval();  
});