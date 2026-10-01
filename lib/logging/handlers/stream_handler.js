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

/**
 * Constructor of the class.
 *
 * @param {Object}
 *            stream The stream to be used.
 * @param {String}
 *            colors The colors to be used in the output ("css" for the
 *            browser console and "ansi" for terminals), detected from
 *            the environment when not provided, an invalid value (eg:
 *            null) disables them.
 */
Logging.StreamHandler = function(stream, colors) {
    this.stream = stream || console;
    this.colors = typeof colors === "undefined" ? Logging.StreamHandler.getColors() : colors;
};

Logging.StreamHandler = _Object.inherit(Logging.StreamHandler, Logging.Handler);

Logging.StreamHandler.MAPPING = {
    NOTSET: "debug",
    DEBUG: "debug",
    INFO: "info",
    WARNING: "warn",
    ERROR: "error",
    CRITICAL: "error"
};

/**
 * Detects the colors supported by the current environment, the
 * environment variables of the terminals (NO_COLOR and FORCE_COLOR)
 * taking precedence over the detection.
 *
 * @return {String} The colors supported by the environment, "ansi"
 *         for terminals, "css" for the browser console and null for
 *         no colors (eg: output redirected to a file).
 */
Logging.StreamHandler.getColors = function() {
    // retrieves the environment variables, which only exist
    // under Node.js (and its derivatives)
    var hasProcess = typeof process !== "undefined" && Boolean(process.env);
    var env = hasProcess ? process.env : {};

    // in case the colors are explicitly disabled or forced through
    // the environment (as defined by no-color.org and force-color.org)
    // the environment value is used, a FORCE_COLOR of 0 (or false)
    // disabling them, as done by Node.js
    if (env.NO_COLOR) return null;
    if (typeof env.FORCE_COLOR !== "undefined") {
        return env.FORCE_COLOR === "0" || env.FORCE_COLOR === "false" ? null : "ansi";
    }

    // in case there's a standard output (Node.js) the colors are only
    // used for terminals (both the standard output and error, as the
    // warnings and errors are printed to the latter), otherwise the
    // browser console is assumed
    if (hasProcess && process.stdout) {
        return process.stdout.isTTY && (!process.stderr || process.stderr.isTTY) ? "ansi" : null;
    }
    return typeof window === "undefined" ? null : "css";
};

Logging.StreamHandler.prototype.emit = function(record) {
    this.base.emit(record);

    // formats the record retrieving the arguments to be
    // printed (message, styles and extra arguments)
    var args = this.formatArgs(record);

    // retrieves the method of the stream for the level of the
    // record, falling back to the info one in case the stream
    // does not provide it (eg: custom streams)
    var name = Logging.StreamHandler.MAPPING[record.getLevelString()];
    var method = this.stream[name] || this.stream.info;

    // prints the message to the stream
    // flushes the stream
    method.apply(this.stream, args);
    this.flush();
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
