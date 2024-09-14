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
class SimpleLog {

    static logQueue = [];
    static dateFormat = "yyyy-MM-dd";
    static filePath = null;
    static logToFile = false;
    static fileName = null;
    static batchSize = null;
    static flushInterval = null;

    static clearLogs() {
        SimpleLog.logQueue = [];
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
        return new SimpleLog( options);
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
         *  filename    // the file name : default (SimpleLog.(yyyy-mm-dd).log)
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
       
        if(options.flushInterval >0 && options.flushInterval< 1000 ) {
            options.flushInterval = 0;
        }
        SimpleLog.dateFormat    = options.dateFormat || "yyyy-MM-dd";
        SimpleLog.filePath      = options.filePath  || __dirname;
        SimpleLog.logToFile     = options.logToFile || false
        SimpleLog.logLevel      = options.logLevel || "*"
        SimpleLog.fileName      = options.fileName || null
        SimpleLog.batchSize     = options.batchSize || 0
        SimpleLog.flushInterval = options.flushInterval || 0

        this.interval =null;

        if(SimpleLog.flushInterval >= 1000 && SimpleLog.logToFile) {
            this.setupExitHandlers()
            this.flushSetup();
        }

        
    }

    writeLog(logEntry, logPrefix) {
        if(getBooleanEnvValue( SimpleLog.logToFile )){
            SimpleLog.logQueue.push(`${logPrefix}  ${logEntry}`);
            if (SimpleLog.logQueue.length >= SimpleLog.batchSize && SimpleLog.flushInterval < 1000 ) {
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
        try{
            clearInterval(this.interval);
        } catch(e) {
            console.log( "No Interval available !")
        }
        
        this.flushLogs();
    }
    async flushLogs() {
        if (SimpleLog.logQueue.length === 0) return;
        const logEntries = SimpleLog.logQueue.join('\n');
        let currentDate = this.formatDate(new Date(), "yyyy-MM-dd");
        const logFilePath = path.join(SimpleLog.filePath || __dirname, currentDate+"-"+SimpleLog.fileName || `SimpleLog.${currentDate}.log`);
        
        try {
            const directory = path.dirname(logFilePath);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
            }
            await this.writeFile(logFilePath, logEntries)
            SimpleLog.logQueue =[];
            
        } catch (error) {
            console.error('Failed to write log:', error);
            // Re-add entries to the queue to retry on next flush
            SimpleLog.logQueue.unshift(...logEntries.split('\n').filter(Boolean).map(entry => entry + '\n'));
        }
    }
    
     flushSetup(){
        
        if(getBooleanEnvValue(SimpleLog.logToFile)) {
            this.interval = setInterval(() => {
                if(SimpleLog.logQueue.length >= SimpleLog.batchSize){
                    this.flushLogs();
                }
            }, SimpleLog.flushInterval || 5000);
        }
    }

    formatDate(date, formatString  ="yyyy-MM-dd") {
        return format(date, SimpleLog.dateFormat || formatString);
    }

    info( msg ){
        if(["*", "info"].includes(SimpleLog.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"INFO".cyan} (${process.pid.toString().white}) ${SimpleLog.sanitize(msg).gray}`);
            this.writeLog(SimpleLog.sanitize(msg), `${this.formatDate(new Date())} ${"INFO"} (${process.pid.toString()})`);
        }
    }

    warn( msg ){
        if(["*", "warn"].includes(SimpleLog.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"WARN".yellow} (${process.pid.toString().white}) ${SimpleLog.sanitize(msg).gray}`);
            this.writeLog(SimpleLog.sanitize(msg),`${this.formatDate(new Date())} ${"WARN"} (${process.pid.toString()})`);
        }
    }

    debug( msg ){
        if(["*", "debug"].includes(SimpleLog.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"DEBUG".green} (${process.pid.toString().white}) ${SimpleLog.sanitize(msg).gray}`);
            this.writeLog(SimpleLog.sanitize(msg), `${this.formatDate(new Date())} ${"DEBUG"} (${process.pid.toString()})`);
        }
    }

    error( msg, error ){ 
        if(["*", "error", "debug"].includes(SimpleLog.logLevel)){
            console.log(`${this.formatDate(new Date()).white} ${"ERROR".red} (${process.pid.toString().white})`)
            if(msg){
                console.log(`${SimpleLog.sanitize(msg).gray}`);
                this.writeLog(SimpleLog.sanitize(msg), `${this.formatDate(new Date())} ${"ERROR"} (${process.pid.toString()})`);
            }if(error){
                console.log(`${SimpleLog.sanitize(error).gray}`)
                this.writeLog(SimpleLog.sanitize(error), `${this.formatDate(new Date())} ${"ERROR"} (${process.pid.toString()})`);
            }
        }
    }
    // Method to handle log and cleanup
    cleanup() {
        console.log(`${this.formatDate(new Date()).white} ${"Warn".yellow} (${process.pid.toString().white}) ${SimpleLog.sanitize("Process Exit Flushing Logs!").gray}`);
        SimpleLog.batchSize = 0;
        this.clearLogInterval();
    }
    setupExitHandlers() {
        process.on('exit', () => this.cleanup());
    
        // Optionally handle other signals like SIGINT (Ctrl+C) and SIGTERM
        const handleSignal = () => {
          this.cleanup();
          setTimeout(()=>{
            process.exit();
          }, 3000);
           // Ensure the process exits after cleanup
        };
        process.on('SIGINT', handleSignal);
        process.on('SIGTERM', handleSignal);
      }
}

module.exports = {
    SimpleLog:SimpleLog,
    log:SimpleLog.initialize
};
