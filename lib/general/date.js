// Hive Colony Framework
// Copyright (c) 2008-2017 Hive Solutions Lda.
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
// __copyright__ = Copyright (c) 2008-2017 Hive Solutions Lda.
// __license__   = Apache License, Version 2.0

var _global = typeof global === "undefined" ? window : global;
var Date = Date || _global.Date || {};

/**
 * Parses the given date string (without utc offset) retrieving an utc timestamp
 * representing the given date.
 *
 * @param {String}
 *            dateString The date string (without utc offset) to be parsed for
 *            retrieval of the timestamp.
 * @return {Integer} The integer representing the utc timestamp in miliseconds.
 */
Date.parseUtc = function(dateString) {
    // creats a new date object
    var date = new Date(dateString);

    // retrieves the time zone name from the date time zone structure
    var dateTimeZoneStructure = date.getTimeZoneStructure();
    var timeZoneName = dateTimeZoneStructure["time_zone_name"];

    // creates the date string from the date string and the time zone name
    // or it uses the new date
    var dateString = dateString ? dateString + " " + timeZoneName : date;

    // parses the date string retrieving the timestamp
    // (in miliseconds) in utc
    var timestamp = Date.parse(dateString);

    // returns the timestamp (in utc)
    return timestamp;
}

/**
 * Retrieves the time zone structure for the current default time zone.
 *
 * @return {Map} The time zone structure for the current default time zone.
 */
Date.prototype.getTimeZoneStructure = function() {
    // retrieves the javascript utc offset
    var javascriptUtcOffset = this.getTimezoneOffset() * -1;

    // calculates the real utc offset from the javascript one
    var utcOffset = javascriptUtcOffset * 60;

    // calculates the absolute javascript utc offset
    var absoluteJavascriptUtcOffset = Math.abs(javascriptUtcOffset);

    // calculates the utc offset in hours
    var utcOffsetHours = Math.floor(absoluteJavascriptUtcOffset / 60);

    // calculates the utc offset in minutes
    var utcOffsetMinutes = absoluteJavascriptUtcOffset % 60;

    // converts the utc offset in hours to string
    var utcOffsetHoursString = utcOffsetHours.toString();

    // converts the utc offset in minutes to string
    var utcOffsetMinutesString = utcOffsetMinutes.toString();

    // retrieves the utc offset in hours string length
    var utcOffsetHoursStringLength = utcOffsetHoursString.length;

    // retrieves the utc offset in minutes string length
    var utcOffsetMinutesStringLength = utcOffsetMinutesString.length;

    // iterates over the remaining digits (while less than two)
    for (var index = utcOffsetHoursStringLength; index < 2; index++) {
        // prepends a zero to the utc offset in hours string
        utcOffsetHoursString = "0" + utcOffsetHoursString;
    }

    // iterates over the remaining digits (while less than two)
    for (var index = utcOffsetMinutesStringLength; index < 2; index++) {
        // prepends a zero to the utc offset in minutes string
        utcOffsetMinutesString = "0" + utcOffsetMinutesString;
    }

    // in case the utc offset is greater or equal to zero
    if (utcOffset >= 0) {
        // prepends the plus operator to the utc offset in hours string
        utcOffsetHoursString = "+" + utcOffsetHoursString;
    } else {
        // prepends the minus operator to the utc offset in hours string
        utcOffsetHoursString = "-" + utcOffsetHoursString;
    }

    // retrieves the time zone name
    var timeZoneName = "GMT" + utcOffsetHoursString + utcOffsetMinutesString;

    // creates the time zone structure
    var timeZoneStructure = {};

    // sets the utc offset value in the time zone structure
    timeZoneStructure["utc_offset"] = utcOffset;

    // sets the time zone name in the time zone structure
    timeZoneStructure["time_zone_name"] = timeZoneName;

    // returns the time zone structure
    return timeZoneStructure;
}

if (typeof module !== "undefined") {
    module.exports = {
        Date: Date
    };
}
