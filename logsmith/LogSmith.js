let colors = require("colors")
const {format} = require("date-fns")
const fs = require('fs');
const path = require('path');

const  getBooleanEnvValue = (envVar)  =>{
    if (envVar === undefined || envVar === null) return false;
    if (typeof envVar === 'boolean') return envVar;
    if (typeof envVar === 'string') {
        // Normalize string values: "true", "false", "1", "0"
        return envVar.toLowerCase() === 'true' || envVar === '1';
    }
    return false;
}
class LogSmith {

    static logQueue = [];
    static dateFormat = "yyyy-MM-dd";
    static filePath = null;
    static logToFile = false;
    static fileName = null;
    static batchSize = null;
    static flushInterval = null;

    static clearLogs() {
        LogSmith.logQueue = [];
    }

    static sanitize( msg ){
        if (msg instanceof String){ return msg}
        if (msg instanceof Number){ return msg.toString()}
        if( msg instanceof Error){
            let buffer =[];
            buffer.push(msg.name || "");
            buffer.push(msg.message || "");
            buffer.push(msg.stack || "");
            return JSON.stringify(buffer);
        }
        return JSON.stringify( msg );
    }

    static initialize( options = {} ){
        return new LogSmith( options);
    }
    
    constructor(options = {}) {
        /**
         * options      
         *  dateFormat (Examples)
         *      "yyyy-MM-dd",             // 2024-08-05
                "dd/MM/yyyy",             // 05/08/2024
                "MMMM do, yyyy",          // August 5th, 2024
                "EEE, MMM d, ''yy",       // Mon, Aug 5, '24
                "HH:mm:ss",               // 14:07:45
                "hh:mm:ss a",             // 02:07:45 PM
                "h:mm a",                 // 2:07 PM
                "MMMM do, yyyy h:mm a",   // August 5th, 2024 2:07 PM
         *  filePath    // The Log File Path
         *  logToFile   // wether to log to a files
         *  logLevel    // Log level *, info, warn, error, debug default: * enables all log levels
         *  filename    // the file name : default (logSmith.(yyyy-mm-dd).log)
         *  batchSize   // The batch Size of queued logs
         *  flushInterval // The Interval or seconds for each log write 
         * 
         *   {
         *      dateFormat:"",
         *      filePath:"",
         *      logToFile: false
         *      fileName: null,
         *      batchSize: null,
         *      flushInterval: null
         *   }
         */
       
        LogSmith.dateFormat    = options.dateFormat || "yyyy-MM-dd";
        LogSmith.filePath      = options.filePath  || __dirname;
        LogSmith.logToFile     = options.logToFile || false
        LogSmith.logLevel      = options.logLevel || "*"
        LogSmith.fileName      = options.fileName || null
        LogSmith.batchSize     = options.batchSize || 0
        LogSmith.flushInterval = options.flushInterval || 0

        this.interval =null;

        if(LogSmith.flushInterval >= 1000 && LogSmith.logToFile) {
            this.flushSetup();
        }

        
    }

    writeLog(logEntry, logPrefix) {
        if(getBooleanEnvValue( LogSmith.logToFile )){
            LogSmith.logQueue.push(`${logPrefix}  ${logEntry}`);
            if (LogSmith.logQueue.length >= LogSmith.batchSize && LogSmith.flushInterval < 1000 ) {
                this.flushLogs();
            }
        }
    }

    writeFile(logFilePath, logEntries ){
        return new Promise((resolve, reject) => {
            fs.appendFile(logFilePath, logEntries + '\n', (err) => {
                if (err) {
                    reject(err);  // If an error occurs, reject the promise
                } else {
                    resolve();    // If successful, resolve the promise
                }
            });
        });
    }

    clearLogInterval(){
        clearInterval(this.interval);
        this.flushLogs();
    }
    async flushLogs() {
        if (LogSmith.logQueue.length === 0) return;
        const logEntries = LogSmith.logQueue.join('');
        let currentDate = this.formatDate(new Date(), "yyyy-MM-dd");
        const logFilePath = path.join(LogSmith.filePath || __dirname, currentDate+"-"+LogSmith.fileName || `logSmith.${currentDate}.log`);
        
        try {
            const directory = path.dirname(logFilePath);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
            }
            await this.writeFile(logFilePath, logEntries)
            LogSmith.logQueue =[];
            
        } catch (error) {
            console.error('Failed to write log:', error);
            // Re-add entries to the queue to retry on next flush
            LogSmith.logQueue.unshift(...logEntries.split('\n').filter(Boolean).map(entry => entry + '\n'));
        }
    }
    
     flushSetup(){
        if(getBooleanEnvValue(LogSmith.logToFile)) {
            this.interval = setInterval(() => {
                this.flushLogs();
            }, LogSmith.flushInterval || 5000);
        }
    }

    formatDate(date, formatString  ="yyyy-MM-dd") {
        return format(date, LogSmith.dateFormat || formatString);
    }

    info( msg ){
        if(["*", "info"].includes(LogSmith.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"INFO".cyan} (${process.pid.toString().white}) ${LogSmith.sanitize(msg).gray}`);
            this.writeLog(LogSmith.sanitize(msg), `${this.formatDate(new Date())} ${"INFO"} (${process.pid.toString()})`);
        }
    }

    warn( msg ){
        if(["*", "warn"].includes(LogSmith.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"WARN".yellow} (${process.pid.toString().white}) ${LogSmith.sanitize(msg).gray}`);
            this.writeLog(LogSmith.sanitize(msg),`${this.formatDate(new Date())} ${"WARN"} (${process.pid.toString()})`);
        }
    }

    debug( msg ){
        if(["*", "debug"].includes(LogSmith.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"DEBUG".green} (${process.pid.toString().white}) ${LogSmith.sanitize(msg).gray}`);
            this.writeLog(LogSmith.sanitize(msg), `${this.formatDate(new Date())} ${"DEBUG"} (${process.pid.toString()})`);
        }
    }

    error( msg, error ){ 
        if(["*", "error", "debug"].includes(LogSmith.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"ERROR".red} (${process.pid.toString().white})`)
            if(msg){
                console.log(`${LogSmith.sanitize(msg).gray}`);
                this.writeLog(LogSmith.sanitize(msg), `${this.formatDate(new Date())} ${"ERROR"} (${process.pid.toString()})`);
            }if(error){
                console.log(`${LogSmith.sanitize(error).gray}`)
                this.writeLog(LogSmith.sanitize(error), `${this.formatDate(new Date())} ${"ERROR"} (${process.pid.toString()})`);
            }
        }
    }
    // Method to handle log and cleanup
    cleanup() {
        console.log(`${this.formatDate(new Date()).white} ${"Warn".yellow} (${process.pid.toString().white}) ${LogSmith.sanitize("Process Exit Flushing Logs!").gray}`);
        this.flushLogs();
    }
    setupExitHandlers() {
        process.on('exit', () => this.cleanup());
    
        // Optionally handle other signals like SIGINT (Ctrl+C) and SIGTERM
        const handleSignal = () => {
          this.cleanup();
          process.exit(); // Ensure the process exits after cleanup
        };
        process.on('SIGINT', handleSignal);
        process.on('SIGTERM', handleSignal);
      }
}

module.exports = {
    LogSmith:LogSmith,
    logSmith:LogSmith.initialize
};
