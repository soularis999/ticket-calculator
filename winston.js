const { createLogger, format, transports } = require('winston');
const { combine, timestamp, simple } = format;
var appRoot = require('app-root-path');

var logDir = process.env.LOG_DIR || `${appRoot}/logs`;

// define the custom settings for each transport (file, console)
var options = {
    file: {
    	filename: `${logDir}/app.log`,
    	handleExceptions: true,
    	json: false,
    	maxsize: 5242880, // 5MB
    	maxFiles: 5,
    	colorize: false
    },
    error: {
    	level: 'error',
    	filename: `${logDir}/error.log`,
    	handleExceptions: true,
    	json: false,
    	maxsize: 5242880, // 5MB
    	maxFiles: 5,
    	colorize: false
    },
    console: {
    	handleExceptions: true,
    	json: false,
    	colorize: true
    }
};

var _level = process.env.LOG_LEVEL || 'info';

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
    transports: [
	new transports.File(options.file),
	new transports.File(options.error),
	new transports.Console(options.console)
    ],
    level: _level,
    format: combine(
	timestamp(),
	simple()
    ),
    exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
	// use the 'info' log level so the output will be picked up by both transports (file and console)
	logger.info(message);
    }
};

module.exports = logger;
