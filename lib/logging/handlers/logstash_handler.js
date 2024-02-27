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
 * @param {String}
 *            url The URL of the Logstash server.
 */
Logging.LogstashHandler = function(url) {
    this.url = new URL(url);
    this.hostname = null;

    try {
        // eslint-disable-next-line camelcase
        if (typeof __webpack_require__ === "undefined") {
            var os = require("os");
            this.hostname = os.hostname();
        }
    } catch (error) {
    }
};

Logging.LogstashHandler = _Object.inherit(Logging.LogstashHandler, Logging.Handler);

Logging.LogstashHandler.isReady = function(url) {
    if (!url) {
        return false;
    }
    try {
        // eslint-disable-next-line no-new
        new URL(url);
    } catch (error) {
        return false;
    }
    return true;
};

Logging.LogstashHandler.prototype.emit = function(record) {
    var messageF = this.format(record);
    var log = {
        "@timestamp": new Date(),
        message: record.getMessage(),
        level: record.getLevelString(),
        message_format: messageF,
        powered_by: "hive-js-util"
    };
    if (this.hostname) {
        log.hostname = this.hostname;
    }
    var urlS = new URL(this.url);
    var username = urlS.username;
    var password = urlS.password;
    urlS.username = "";
    urlS.password = "";
    fetch(String(urlS) + "tags/default", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(username + ":" + password)
        },
        body: JSON.stringify(log)
    }).catch(error => {
        console.error("Failed to send log to Logstash", error);
    });
};

if (typeof module !== "undefined") {
    module.exports = {
        Logging: Logging
    };
}
