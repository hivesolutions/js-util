// Hive Colony Framework
// Copyright (c) 2008-2024 Hive Solutions Lda.
//
// This file is part of Hive Colony Framework.
//
// Hive Colony Framework is free software: you can redistribute it and/or modify
// it under the terms of the Apache License as published by the Apache
// Foundation, either version 2.0 of the License, or (at your option) any
// later version.
//
// Hive Colony Framework is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// Apache License for more details.
//
// You should have received a copy of the Apache License along with
// Hive Colony Framework. If not, see <http://www.apache.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __copyright__ = Copyright (c) 2008-2024 Hive Solutions Lda.
// __license__   = Apache License, Version 2.0

var _global = typeof global === "undefined" ? window : global;
var Logging = (_global.Logging = _global.Logging || {});

/**
 * The currently created loggers, kept in case the logging is
 * loaded more than once (eg: bundled in other libraries).
 *
 * @type Map
 */
Logging.loggers = Logging.loggers || {};

Logging.getLogger = function(loggerName, defaults) {
    // ensures the proper loading of the stream handler to avoid
    // any unwanted behaviour (in the defaults creation)
    if (typeof require !== "undefined") {
        require("./handlers");
        require("./formatters");
    }

    // verifies if the defaults have been sent and if that's
    // not the case builds the default ones
    if (typeof defaults === "undefined") {
        defaults = {
            handlers: [Logging.StreamHandler],
            formatter: Logging.SimpleFormatter
        };
    }

    // starts the initial reference to logger, this may
    // be constructed by the end of the execution
    var logger = null;

    // retrieves the logger name, falling back to the
    // default name in case none is provided
    loggerName = loggerName || Logging.constants.DEFAULT_LOGGER_NAME;

    // in case there is no logger with the given
    // name in the logger map
    if (!Logging.loggers[loggerName]) {
        // creates a new logger with the given name (and propagation
        // to the default logger) and sets the logger in the loggers map
        logger = new Logging.Logger(
            loggerName,
            defaults.level || undefined,
            undefined,
            defaults.propagate
        );
        Logging.loggers[loggerName] = logger;

        // iterates over the multiple values of the defaults
        // to build the proper handlers
        var defaultHandlers = defaults.handlers || [];
        for (var index = 0; index < defaultHandlers.length; index++) {
            var handler = new defaultHandlers[index]();
            logger.addHandler(handler);
        }

        // creates the default formatter for the logger and set it
        // changing the value for all the current handlers
        var DefaultFormatter = defaults.formatter || null;
        if (DefaultFormatter) {
            var formatter = new DefaultFormatter();
            logger.setFormatter(formatter);
        }
    }

    // retrieves the logger and returns it to
    // the caller method
    logger = Logging.loggers[loggerName];
    return logger;
};

Logging.debug = function(messageValue) {
    var logger = Logging.getLogger(Logging.constants.DEFAULT_LOGGER_NAME);
    logger.debug.apply(logger, arguments);
};

Logging.info = function(messageValue) {
    var logger = Logging.getLogger(Logging.constants.DEFAULT_LOGGER_NAME);
    logger.info.apply(logger, arguments);
};

Logging.warn = function(messageValue) {
    var logger = Logging.getLogger(Logging.constants.DEFAULT_LOGGER_NAME);
    logger.warn.apply(logger, arguments);
};

Logging.warning = Logging.warn;

Logging.error = function(messageValue) {
    var logger = Logging.getLogger(Logging.constants.DEFAULT_LOGGER_NAME);
    logger.error.apply(logger, arguments);
};

Logging.critical = function(messageValue) {
    var logger = Logging.getLogger(Logging.constants.DEFAULT_LOGGER_NAME);
    logger.critical.apply(logger, arguments);
};

/**
 * The map containing the logging constants.
 *
 * @type Map
 */
Logging.constants = {
    /**
     * The critical number.
     *
     * @type Integer
     */
    CRITICAL: 50,

    /**
     * The error number.
     *
     * @type Integer
     */
    ERROR: 40,

    /**
     * The warning number.
     *
     * @type Integer
     */
    WARNING: 30,

    /**
     * The info number.
     *
     * @type Integer
     */
    INFO: 20,

    /**
     * The debug number.
     *
     * @type Integer
     */
    DEBUG: 10,

    /**
     * The not set number.
     *
     * @type Integer
     */
    NOTSET: 0,

    /**
     * The default level number.
     *
     * @type Integer
     */
    DEFAULT_LEVEL: 20,

    /**
     * The critical value.
     *
     * @type String
     */
    CRITICAL_VALUE: "CRITICAL",

    /**
     * The error value.
     *
     * @type String
     */
    ERROR_VALUE: "ERROR",

    /**
     * The warning value.
     *
     * @type String
     */
    WARNING_VALUE: "WARNING",

    /**
     * The info value.
     *
     * @type String
     */
    INFO_VALUE: "INFO",

    /**
     * The debug value.
     *
     * @type String
     */
    DEBUG_VALUE: "DEBUG",

    /**
     * The not set value.
     *
     * @type String
     */
    NOTSET_VALUE: "NOTSET",

    /**
     * The default level value.
     *
     * @type String
     */
    DEFAULT_LEVEL_VALUE: "INFO",

    /**
     * The default logger name.
     *
     * @type String
     */
    DEFAULT_LOGGER_NAME: "default"
};

Logging.LevelsMap = {};

Logging.LevelsMap[Logging.constants.CRITICAL] = Logging.constants.CRITICAL_VALUE;
Logging.LevelsMap[Logging.constants.ERROR] = Logging.constants.ERROR_VALUE;
Logging.LevelsMap[Logging.constants.WARNING] = Logging.constants.WARNING_VALUE;
Logging.LevelsMap[Logging.constants.INFO] = Logging.constants.INFO_VALUE;
Logging.LevelsMap[Logging.constants.DEBUG] = Logging.constants.DEBUG_VALUE;
Logging.LevelsMap[Logging.constants.NOTSET] = Logging.constants.NOTSET_VALUE;

Logging.LevelsMap[Logging.constants.CRITICAL_VALUE] = Logging.constants.CRITICAL;
Logging.LevelsMap[Logging.constants.ERROR_VALUE] = Logging.constants.ERROR;
Logging.LevelsMap[Logging.constants.WARNING_VALUE] = Logging.constants.WARNING;
Logging.LevelsMap[Logging.constants.INFO_VALUE] = Logging.constants.INFO;
Logging.LevelsMap[Logging.constants.DEBUG_VALUE] = Logging.constants.DEBUG;
Logging.LevelsMap[Logging.constants.NOTSET_VALUE] = Logging.constants.NOTSET;

/**
 * Constructor of the class.
 *
 * @param {String}
 *            loggerName The name of the logger.
 * @param {Integer}
 *            level The level of verbosity of the logger.
 * @param {Array}
 *            handlers The handlers of the logger.
 * @param {Boolean}
 *            propagate If the records of the logger should also be
 *            handled by the handlers of the default logger.
 */
Logging.Logger = function(loggerName, level, handlers, propagate) {
    this.loggerName = loggerName;

    this.level = typeof level === "undefined" ? Logging.constants.DEFAULT_LEVEL : level;
    this.handlers = typeof handlers === "undefined" ? [] : handlers;
    this.propagate = typeof propagate === "undefined" ? false : propagate;
};

/**
 * Adds a new handler to the logger.
 *
 * @param {Handler}
 *            handler The handler to be added to the logger.
 */
Logging.Logger.prototype.addHandler = function(handler) {
    this.handlers.push(handler);
};

/**
 * Sets the level of verbosity.
 *
 * @param {String}
 *            level The level of verbosity to be set.
 */
Logging.Logger.prototype.setLevel = function(level) {
    this.level = level;
};

Logging.Logger.prototype.debug = function(messageValue) {
    if (this.isEnabledFor(Logging.constants.DEBUG)) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._log(messageValue, Logging.constants.DEBUG, args);
    }
};

Logging.Logger.prototype.info = function(messageValue) {
    if (this.isEnabledFor(Logging.constants.INFO)) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._log(messageValue, Logging.constants.INFO, args);
    }
};

Logging.Logger.prototype.warn = function(messageValue) {
    if (this.isEnabledFor(Logging.constants.WARNING)) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._log(messageValue, Logging.constants.WARNING, args);
    }
};

Logging.Logger.prototype.warning = Logging.Logger.prototype.warn;

Logging.Logger.prototype.error = function(messageValue) {
    if (this.isEnabledFor(Logging.constants.ERROR)) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._log(messageValue, Logging.constants.ERROR, args);
    }
};

Logging.Logger.prototype.critical = function(messageValue) {
    if (this.isEnabledFor(Logging.constants.CRITICAL)) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._log(messageValue, Logging.constants.CRITICAL, args);
    }
};

Logging.Logger.prototype.isEnabledFor = function(level) {
    return level >= this.getEffectiveLevel();
};

Logging.Logger.prototype.getEffectiveLevel = function() {
    return this.level;
};

Logging.Logger.prototype.setFormatter = function(formatter) {
    for (var index = 0; index < this.handlers.length; index++) {
        var handler = this.handlers[index];
        handler.setFormatter(formatter);
    }
};

Logging.Logger.prototype._log = function(messageValue, level, args) {
    // creates a new record for the message value and the level,
    // together with the name of the logger and the extra arguments
    var record = new Logging.Record(messageValue, level, this.loggerName, args);

    // handles the record
    this.handle(record);
};

Logging.Logger.prototype.handle = function(record) {
    // calls the handlers for the record
    this.callHandlers(record);
};

Logging.Logger.prototype.callHandlers = function(record) {
    // iterates over all the handlers
    for (var index = 0; index < this.handlers.length; index++) {
        // retrieves the current handler and
        // handles the record with the handler
        var handler = this.handlers[index];
        handler.handle(record);
    }

    // in case the logger propagates its records and it's not the
    // default logger, the record is also handled by the handlers
    // of the default logger (eg: for the reporting of errors)
    if (this.propagate && this.loggerName !== Logging.constants.DEFAULT_LOGGER_NAME) {
        Logging.getLogger(Logging.constants.DEFAULT_LOGGER_NAME).callHandlers(record);
    }
};

/**
 * Constructor of the class.
 *
 * @param {String}
 *            message The message.
 * @param {Integer}
 *            level The level.
 * @param {String}
 *            name The name of the logger of the record.
 * @param {Array}
 *            args The extra arguments of the logging of the record.
 */
Logging.Record = function(message, level, name, args) {
    this.message = message;
    this.level = level;
    this.name = typeof name === "undefined" ? Logging.constants.DEFAULT_LOGGER_NAME : name;
    this.args = typeof args === "undefined" ? [] : args;
    this.created = new Date();
};

/**
 * Retrieves the message.
 *
 * @return {String} The message.
 */
Logging.Record.prototype.getMessage = function() {
    return this.message;
};

/**
 * Retrieves the level.
 *
 * @return {Integer} The level.
 */
Logging.Record.prototype.getLevel = function() {
    return this.level;
};

/**
 * Retrieves the level string value.
 *
 * @return {String} The level string value.
 */
Logging.Record.prototype.getLevelString = function() {
    return Logging.LevelsMap[this.level];
};

/**
 * Retrieves the name of the logger.
 *
 * @return {String} The name of the logger.
 */
Logging.Record.prototype.getName = function() {
    return this.name;
};

/**
 * Retrieves the extra arguments.
 *
 * @return {Array} The extra arguments.
 */
Logging.Record.prototype.getArgs = function() {
    return this.args;
};

/**
 * Retrieves the date of creation.
 *
 * @return {Date} The date of creation.
 */
Logging.Record.prototype.getCreated = function() {
    return this.created;
};

/**
 * Constructor of the class.
 */
Logging.Handler = function() {
    this.formatter = null;
};

Logging.Handler.isReady = function() {
    return true;
};

/**
 * Sets the formatter for the handler.
 *
 * @param {Formatter}
 *            formatter The formatter for the handler.
 */
Logging.Handler.prototype.setFormatter = function(formatter) {
    this.formatter = formatter;
};

Logging.Handler.prototype.handle = function(record) {
    // emits the record so that it gets pipelined
    // to the inner implementation
    this.emit(record);
};

Logging.Handler.prototype.format = function(record) {
    // sets the initial value for the message
    var message = null;

    // in case no formatter
    if (!this.formatter) {
        // retrieves the record message and returns
        // it to the caller method
        message = record.getMessage();
        return message;
    }

    // formats the message using the formatter
    // and returns it to the caller
    message = this.formatter.format(record);
    return message;
};

Logging.Handler.prototype.formatArgs = function(record) {
    // sets the initial value for the arguments
    var args = null;

    // in case no formatter (or a formatter that only
    // formats messages) is defined
    if (!this.formatter || !this.formatter.formatArgs) {
        // retrieves the formatted message followed by the extra
        // arguments, after a string directive in case there are
        // extra arguments (so that the message is never interpreted
        // as a format) and returns them to the caller
        args = [this.format(record)].concat(record.getArgs());
        args = args.length > 1 ? ["%s"].concat(args) : args;
        return args;
    }

    // formats the arguments using the formatter, with the
    // colors of the handler and returns them to the caller
    args = this.formatter.formatArgs(record, this.colors);
    return args;
};

Logging.Handler.prototype.flush = function() {};

Logging.Handler.prototype.emit = function(record) {};

/**
 * Constructor of the class.
 */
Logging.Formatter = function() {};

Logging.Formatter.prototype.format = function(record) {};

Logging.Formatter.prototype.formatArgs = function(record, colors) {
    // formats the message followed by the extra arguments, after a
    // string directive in case there are extra arguments, so that
    // the message is never interpreted as a format by the console
    var args = [this.format(record)].concat(record.getArgs());
    return args.length > 1 ? ["%s"].concat(args) : args;
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
