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
 *            stream The stream to be used.
 */
Logging.StreamHandler = function(stream) {
    this.stream = stream || console;
};

Logging.StreamHandler = _Object.inherit(Logging.StreamHandler, Logging.Handler);

Logging.StreamHandler.prototype.emit = function(record) {
    this.base.emit(record);

    // formats the record retrieving the message
    var message = this.format(record);

    // prints the message to the stream
    // flushes the stream
    this.stream.info(message);
    this.flush();
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
