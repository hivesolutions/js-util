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
 */
Logging.SimpleFormatter = function(formatString) {
    this.formatString = formatString || "{asctime} [{level}] {message}";
};

Logging.SimpleFormatter = _Object.inherit(Logging.SimpleFormatter, Logging.Formatter);

Logging.SimpleFormatter.prototype.format = function(record) {
    var date = new Date();
    var asctime = "{0}-{1}-{2} {3}:{4}:{5},{6}".format(
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    );
    var level = record.getLevelString();
    var message = record.getMessage();
    return this.formatString.formatOptions({
        level: level,
        asctime: asctime,
        message: message
    });
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
