// Hive Colony Framework
// Copyright (C) 2008-2012 Hive Solutions Lda.
//
// This file is part of Hive Colony Framework.
//
// Hive Colony Framework is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Hive Colony Framework is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Hive Colony Framework. If not, see <http://www.gnu.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2012 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

/**
 * Constructor of the class.
 *
 * @param {Object}
 *            stream The stream to be used.
 */
Logging.LoggyHandler = function(options) {
    // starts the queue of pending messages
    this.recordQueue = [];

    // sets the current scope
    var scope = this;

    jQuery(document).ready(function() {
                // starts the loggy structures
                jQuery("body").loggy("default", options);

                // flushes the handler
                scope.flush();
            });
};

Logging.LoggyHandler = _Object.inherit(Logging.LoggyHandler, Logging.Handler);

Logging.LoggyHandler.prototype.flush = function() {
    this.base.flush();

    // iterates over all the records in the record queue
    for (var index = 0; index < this.recordQueue.length; index++) {
        // retrieves the current record
        var record = this.recordQueue[index];

        // emits the record
        this.emit(record);
    }

    // creates a new record queue
    this.recordQueue = [];
}

Logging.LoggyHandler.prototype.emit = function(record) {
    this.base.emit(record);

    // in case the structure is not initialized
    if (!this.initialized()) {
        // adds the record to the records queue
        this.recordQueue.push(record);

        // returns immediately
        return;
    }

    // formats the record retrieving the message
    var message = this.format(record);

    // retrieves the record level string
    var levelString = record.getLevelString();

    // retrieves the message type by lower casing the level string
    var messageType = levelString.toLowerCase();

    // sends the log message to loggy
    jQuery("body").loggy("log", {
                message : message,
                messageType : messageType
            });
}

Logging.LoggyHandler.prototype.initialized = function() {
    return jQuery("body").loggy("initialized");
}
