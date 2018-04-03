// Hive Colony Framework
// Copyright (c) 2008-2018 Hive Solutions Lda.
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
// __copyright__ = Copyright (c) 2008-2018 Hive Solutions Lda.
// __license__   = Apache License, Version 2.0

if (typeof require !== "undefined") {
    var logging = require("./logging");
    var general = require("../general");
    var Logging = logging.Logging;
    var _Object = general._Object;
}

var _global = typeof global === "undefined" ? window : global;
var Logging = Logging || _global.Logging || {};

/**
 * Constructor of the class.
 */
Logging.ConsolaHandler = function(instance, noDefaults) {
    // tries to require the consola dependency to be used
    // for the ouput of the logging
    var consola = require("consola");
    this.instance = instance || new consola.Consola({
        level: 0,
        reporters: [],
        types: []
    });
    if (!noDefaults) {
        this.instance.add(new consola.FancyReporter());
    }
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

Logging.ConsolaHandler.instances = {};

Logging.ConsolaHandler.isReady = function() {
    try {
        require.resolve("consola");
    } catch (error) {
        return false;
    }
    return true;
};

Logging.ConsolaHandler.prototype.emit = function(record) {
    this.base.emit(record);

    // tries to require the consola dependency to be used
    // for the ouput of the logging
    var consola = require("consola");

    // formats the record retrieving the message that
    // is going to be sent to the concrete handler
    var message = this.format(record);

    // retrieves the level string for the current record
    // and uses it to retrieve the associated method name
    // fo the consola environment
    var levelString = record.getLevelString();
    var name = Logging.ConsolaHandler.MAPPING[levelString];

    // calls the appropriate method under the consola environment
    // for the logging of the message
    this.instance[name](message);
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
