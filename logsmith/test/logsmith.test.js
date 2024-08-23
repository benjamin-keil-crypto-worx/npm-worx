const mockfs = require('mock-fs');
const {LogSmith} = require("../index");

const fs = require("fs");
const path = require("path")
const {testOptions} = require("./resources/testOptions")
describe('Logger Class', () => {

    afterEach(() => {
        // Restore the original file system after each test
        mockfs.restore();
    });

    it('should log all messaged to console', () => {
        // Spy on console.log
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = LogSmith.initialize(testOptions.logAllNoFileWrite)
        logger.info("Test Log Info Message");
        logger.warn("Test Warn Message");
        logger.debug("Test Debug Message");
        logger.error("Test Error Message");
        logger.error(new Error("Error Message"))

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Log Info Message'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Warn Message'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Debug Message'));
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));

        consoleSpy.mockRestore();
    });

    it('should log only debug and error messages to console', () => {
        // Spy on console.log
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = LogSmith.initialize(testOptions.logDebugNoFileWrite);
    
        logger.info("Test Log Info Message");
        expect(consoleSpy).not.toHaveBeenCalled();
        
        logger.warn("Test Warn Message");
        expect(consoleSpy).not.toHaveBeenCalled();
       
        logger.error("Test Error Message");
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
        
        logger.error(new Error("Error Message"))
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("ERROR"));


        logger.debug("Test Debug Message");
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Debug Message'));

        consoleSpy.mockRestore();
    });

    it('should log only info  to console', () => {
        // Spy on console.log
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = LogSmith.initialize(testOptions.logInfoNoFileWrite);
    
        logger.debug("Test Debug Message");
        expect(consoleSpy).not.toHaveBeenCalled();
        
        logger.warn("Test Warn Message");
        expect(consoleSpy).not.toHaveBeenCalled();
       
        logger.error("Test Error Message");
        expect(consoleSpy).not.toHaveBeenCalled();

        
        logger.error(new Error("Error Message"))
        expect(consoleSpy).not.toHaveBeenCalled();


        logger.info("Test Info Message");
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Info Message'));

        consoleSpy.mockRestore();
    });

    it('should log only warning to console', () => {
        // Spy on console.log
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = LogSmith.initialize(testOptions.logWarnNoFileWrite);
    
        logger.debug("Test Debug Message");
        expect(consoleSpy).not.toHaveBeenCalled();
        
        logger.info("Test Info Message"); 
        expect(consoleSpy).not.toHaveBeenCalled();
       
        logger.error("Test Error Message");
        expect(consoleSpy).not.toHaveBeenCalled();

        
        logger.error(new Error("Error Message"))
        expect(consoleSpy).not.toHaveBeenCalled();


        logger.warn("Test Warn Message");
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Warn Message'));

        consoleSpy.mockRestore();
    });

    it('should log only errors to console', () => {
        // Spy on console.log
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const logger = LogSmith.initialize(testOptions.logErrorNoFileWrite);
    
        logger.debug("Test Debug Message");
        expect(consoleSpy).not.toHaveBeenCalled();
        
        logger.info("Test Info Message"); 
        expect(consoleSpy).not.toHaveBeenCalled();
       
        logger.warn("Test Warn Message");
        expect(consoleSpy).not.toHaveBeenCalled();

        logger.error(new Error("Error Message")) 
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));

        consoleSpy.mockRestore();
    });
    it('it should  call flushLog for all Console logs', () => {
         
        
         const logger = LogSmith.initialize(testOptions.logAllWithFileWrite);
        // Spy on LogSmith
        const logSmithSpy = jest.spyOn(logger, 'flushLogs').mockImplementation();
        logger.error(new Error("Error Message")) 
        logger.warn("Test Warn Message");
        logger.info("Test Warn Message");
        logger.debug("Test Warn Message");

        // Check how many times it was called
        expect(logSmithSpy).toHaveBeenCalledTimes(4);
    });
    it('it should  call flushLog one after six 7 time logging', () => {
       
       LogSmith.clearLogs();
       const logger = LogSmith.initialize(testOptions.logAllWithFileWriteAndFlushSize);
       // Spy on LogSmith
       const logSmithSpy = jest.spyOn(logger, 'flushLogs').mockImplementation();
       logger.error(new Error("Error Message")) 
       logger.warn("Test Warn Message");
       logger.info("Test Warn Message");
       logger.debug("Test Warn Message");
       logger.warn("Test Warn Message");
       logger.info("Test Warn Message");
       LogSmith.clearLogs();
       logger.debug("Test Warn Message");

       // Check how many times it was called
       expect(logSmithSpy).toHaveBeenCalledTimes(1);
   });
});

