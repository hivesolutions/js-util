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
 */
Logging.SimpleFormatter = function(formatString) {
    this.formatString = formatString || "{asctime} [{level}] {message}";
};

Logging.SimpleFormatter = _Object.inherit(Logging.SimpleFormatter, Logging.Formatter);

/**
 * The map containing the styles of the options of the format, for
 * each of the supported colors, CSS styles for the browser console
 * (through the "%c" directive) and ANSI escape codes for terminals.
 *
 * @type Map
 */
Logging.SimpleFormatter.COLORS = {
    css: {
        asctime: "color: gray",
        level: {
            NOTSET: "background: #6b7280; color: white; font-weight: bold; border-radius: 3px",
            DEBUG: "background: #6b7280; color: white; font-weight: bold; border-radius: 3px",
            INFO: "background: #2563eb; color: white; font-weight: bold; border-radius: 3px",
            WARNING: "background: #d97706; color: white; font-weight: bold; border-radius: 3px",
            ERROR: "background: #dc2626; color: white; font-weight: bold; border-radius: 3px",
            CRITICAL: "background: #7f1d1d; color: white; font-weight: bold; border-radius: 3px"
        },
        name: [
            "color: #0891b2; font-weight: bold",
            "color: #7c3aed; font-weight: bold",
            "color: #db2777; font-weight: bold",
            "color: #059669; font-weight: bold",
            "color: #4f46e5; font-weight: bold",
            "color: #65a30d; font-weight: bold",
            "color: #c026d3; font-weight: bold",
            "color: #0d9488; font-weight: bold",
            "color: #9333ea; font-weight: bold",
            "color: #16a34a; font-weight: bold"
        ],
        reset: ""
    },
    ansi: {
        asctime: "\u001b[90m",
        level: {
            NOTSET: "\u001b[1;90m",
            DEBUG: "\u001b[1;90m",
            INFO: "\u001b[1;36m",
            WARNING: "\u001b[1;33m",
            ERROR: "\u001b[1;31m",
            CRITICAL: "\u001b[1;97;41m"
        },
        name: [
            "\u001b[1;32m",
            "\u001b[1;34m",
            "\u001b[1;35m",
            "\u001b[1;92m",
            "\u001b[1;94m",
            "\u001b[1;95m"
        ],
        reset: "\u001b[0m"
    }
};

/**
 * Selects the style for the given name from the given sequence of
 * styles, using a hash of the name, so that the same name always
 * gets the same style (as done by the debug library).
 *
 * @param {String}
 *            name The name to select the style for.
 * @param {Array}
 *            styles The sequence of styles to select from.
 * @return {String} The style selected for the name.
 */
Logging.SimpleFormatter.selectColor = function(name, styles) {
    // computes a 32 bit hash of the name, iterating
    // over the complete set of its characters
    var hash = 0;
    name = String(name);
    for (var index = 0; index < name.length; index++) {
        hash = (hash << 5) - hash + name.charCodeAt(index);
        hash |= 0;
    }

    // uses the hash to select the style from the
    // sequence of styles and returns it
    return styles[Math.abs(hash) % styles.length];
};

Logging.SimpleFormatter.prototype.format = function(record) {
    var options = this.getOptions(record);
    return this.formatString.formatOptions(options);
};

Logging.SimpleFormatter.prototype.formatArgs = function(record, colors) {
    // retrieves the styles for the requested colors and in case
    // there are none (no colors) formats the record as a single
    // message followed by the extra arguments of the record, after
    // a string directive in case there are extra arguments (so that
    // the message is never interpreted as a format)
    var styles = colors ? Logging.SimpleFormatter.COLORS[colors] : null;
    if (!styles) {
        var _args = [this.format(record)].concat(record.getArgs());
        return _args.length > 1 ? ["%s"].concat(_args) : _args;
    }

    // splits the format string around the message, as the message is
    // sent as an argument of its own (never interpreted as a format),
    // removing the spaces around it, as they're added by the console
    var options = this.getOptions(record);
    var index = this.formatString.indexOf("{message}");
    var head = index === -1 ? this.formatString : this.formatString.slice(0, index);
    var tail = index === -1 ? "" : this.formatString.slice(index + "{message}".length);
    head = head.replace(/\s+$/, "");
    tail = tail.replace(/^\s+/, "").formatOptions(options);

    // styles each of the options of the head of the format string, the
    // CSS styles are sent as arguments of the "%c" directives and the
    // ANSI codes are added around the values, escaping the percent
    // signs of the head, as it's interpreted as a format
    var values = [];
    var nameStyle = Logging.SimpleFormatter.selectColor(record.getName(), styles.name);
    head = head.replace(/{([a-zA-Z0-9_]*)}|[^{]+|{/g, function(match, key) {
        // in case the match is not an option it's
        // escaped and returned as it is
        if (typeof key === "undefined") {
            return match.replace(/%/g, "%%");
        }

        // retrieves the value of the option and its style, in case
        // no style is defined for the option returns its value
        var value = String(options[key]).replace(/%/g, "%%");
        var style = null;
        if (key === "asctime") style = styles.asctime;
        if (key === "level") style = styles.level[record.getLevelString()];
        if (key === "name") style = nameStyle;
        if (!style) {
            return value;
        }

        // in case the colors are ANSI codes they're added around the
        // value, otherwise the CSS styles are sent as arguments
        if (colors === "ansi") {
            return style + value + styles.reset;
        }
        values.push(style, styles.reset);
        value = key === "level" ? " " + value + " " : value;
        return "%c" + value + "%c";
    });

    // builds the arguments from the head, the CSS styles, the message, the
    // tail and the extra arguments, unescaping the percent signs of the
    // head in case nothing follows it (as it's not interpreted as a format)
    // and using a string directive as the head in case there's none and a
    // string is followed by other arguments (so that it's never interpreted
    // as a format, while other values remain inspectable)
    var args = head ? [head].concat(values) : [];
    if (index !== -1) args.push(record.getMessage());
    if (tail) args.push(tail);
    args = args.concat(record.getArgs());
    if (head && args.length === 1) args[0] = head.replace(/%%/g, "%");
    if (!head && args.length > 1 && typeof args[0] === "string") args.unshift("%s");
    return args;
};

Logging.SimpleFormatter.prototype.getOptions = function(record) {
    // formats the date of the record padding its values with zeros,
    // with no use of padStart (and repeat), as they are not available
    // in older browsers and the formatting must never fail
    var date = record.getCreated();
    var asctime = "{0}-{1}-{2} {3}:{4}:{5},{6}".format(
        date.getFullYear(),
        ("0" + (date.getMonth() + 1)).slice(-2),
        ("0" + date.getDate()).slice(-2),
        ("0" + date.getHours()).slice(-2),
        ("0" + date.getMinutes()).slice(-2),
        ("0" + date.getSeconds()).slice(-2),
        ("00" + date.getMilliseconds()).slice(-3)
    );
    var level = record.getLevelString();
    var name = record.getName();
    var message = record.getMessage();
    return {
        level: level,
        asctime: asctime,
        name: name,
        message: message
    };
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
