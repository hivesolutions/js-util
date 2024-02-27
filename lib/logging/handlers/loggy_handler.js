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

if (typeof require !== "undefined") {
    var logging = require("../logging");
    var general = require("../../general");
    var Logging = logging.Logging;
    var _Object = general._Object;
}

var _global = typeof global === "undefined" ? window : global;
var jQuery = (_global.jQuery = _global.jQuery || null);

/**
 * Constructor of the class.
 *
 * @param {Object}
 *            options The options for the handler construction.
 */
Logging.LoggyHandler = function(options) {
    // starts the queue of pending messages
    this.recordQueue = [];

    // sets the current scope
    var scope = this;

    jQuery(document).ready(function() {
        // starts the loggy structures and then
        // runs the flush operation
        jQuery("body").loggy("default", options);
        scope.flush();
    });
};

Logging.LoggyHandler = _Object.inherit(Logging.LoggyHandler, Logging.Handler);

Logging.LoggyHandler.prototype.flush = function() {
    this.base.flush();

    // iterates over all the records in the record queue
    for (var index = 0; index < this.recordQueue.length; index++) {
        // retrieves the current record and
        // emits the record
        var record = this.recordQueue[index];
        this.emit(record);
    }

    // creates a new record queue
    this.recordQueue = [];
};

Logging.LoggyHandler.prototype.emit = function(record) {
    this.base.emit(record);

    // in case the structure is not initialized, the emit
    // operation in loggy must be delayed
    if (!this.initialized()) {
        // adds the record to the records queue and
        // then return immediately as there's nothing
        // else that may be done for now
        this.recordQueue.push(record);
        return;
    }

    // formats the record retrieving the message that
    // is going to be sent to the concrete handler
    var message = this.format(record);

    // retrieves the record level string and runs the
    // lowercasing operation in it to retrieve the current
    // valid message type value for it
    var levelString = record.getLevelString();
    var messageType = levelString.toLowerCase();

    // sends the log message to the loggy so that it can
    // be properly handled by it
    jQuery("body").loggy("log", {
        message: message,
        messageType: messageType
    });
};

Logging.LoggyHandler.prototype.initialized = function() {
    return jQuery("body").loggy("initialized");
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
