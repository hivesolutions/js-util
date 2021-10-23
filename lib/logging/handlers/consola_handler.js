// Hive Colony Framework
// Copyright (c) 2008-2020 Hive Solutions Lda.
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
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2020 Hive Solutions Lda.
// __license__   = Apache License, Version 2.0

if (typeof require !== "undefined") {
    var logging = require("../logging");
    var general = require("../../general");
    var Logging = logging.Logging;
    var _Object = general._Object;
}

/**
 * Constructor of the class.
 *
 * @param {Object}
 *            instance The options console instance to be used in the construction.
 * @param {Boolean}
 *            noDefaults If the defaults (handlers) should not be applied to a possible
 * new instance to be constructed.
 */
Logging.ConsolaHandler = function(instance, noDefaults) {
    // tries to require the consola dependency to be used
    // for the output of the logging, notice that if webpack
    // exits the requirement is ignored
    // eslint-disable-next-line camelcase
    if (typeof __webpack_require__ === "undefined") {
        var consola = require("consola");
    }

    // creates the consola handler instance according to the
    // pre-defined parameters (only in case no instance is provided)
    var parameters = {
        level: consola.LogLevel.Debug,
        reporters: [],
        types: []
    };
    this.instance = instance || (consola.create ? consola : new consola.Consola(parameters));

    // in case the consola create method exists then the new API
    // is available and some additional "patching" operations must
    // be performed to provide compatibility
    if (consola.create) {
        consola.level = consola.LogLevel.Debug;
    }

    // in case the default handlers are required and the fancy
    // reporter is available add it to the instance
    if (!noDefaults && consola.FancyReporter) {
        // clears any if the previously added reporters and then
        // adds the fancy reporter as the default one
        this.instance.clear();
        this.instance.add(new consola.FancyReporter());
    }

    // runs a series of patching operations that will enable
    // a greater level of compatibility
    if (!this.instance.warning) this.instance.warning = this.instance.warn;
};

Logging.ConsolaHandler = _Object.inherit(Logging.ConsolaHandler, Logging.Handler);

Logging.ConsolaHandler.MAPPING = {
    NOTSET: "debug",
    DEBUG: "debug",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    CRITICAL: "critical"
};

Logging.ConsolaHandler.isReady = function() {
    try {
        // eslint-disable-next-line camelcase
        if (typeof __webpack_require__ === "undefined") {
            require.resolve("consola");
        }
    } catch (error) {
        return false;
    }
    if (!process || !process.stdout || !process.stdout.isTTY) {
        return false;
    }
    return true;
};

Logging.ConsolaHandler.prototype.emit = function(record) {
    this.base.emit(record);

    // formats the record retrieving the message that
    // is going to be sent to the concrete handler
    var message = this.format(record);

    // retrieves the level string for the current record
    // and uses it to retrieve the associated method name
    // fo the consola environment
    var levelString = record.getLevelString();
    var name = Logging.ConsolaHandler.MAPPING[levelString];

    // in case the method for the requested level string is
    // not available then throws a new error
    if (!this.instance[name]) {
        throw new Error("Invalid logging method '" + name + "'");
    }

    // calls the appropriate method under the consola environment
    // for the logging of the message
    this.instance[name](message);
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
