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

var String = String || {};

if (typeof(String.prototype.trim) === "undefined") {
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, "");
    };
}

if (typeof(String.prototype.startsWith) === "undefined") {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

String.prototype.strip = function(s) {
    var regex = new RegExp("^" + s + "+|" + s + "+$", "g");
    return String(this).replace(regex, "");
};

/**
 * The compiled options regular expression.
 */
String.prototype.optionsRegex = new RegExp("\{[a-zA-Z0-9_]*(?=\})", "g");

/**
 * Formats the given string according to the arguments.
 *
 * @param {String}
 *            stringValue The string to format.
 * @return {String} The formatted value.
 */
String.format = function(stringValue) {
    // iterates over all the arguments length for
    // string replacement
    for (var index = 1; index < arguments.length; index++) {
        // replaces the string value for the template value
        stringValue = stringValue.replace("{" + (index - 1) + "}",
            arguments[index]);
    }

    // returns the string value
    return stringValue;
}

/**
 * Formats the given string according to the arguments. This method used the
 * proper string for formatting.
 *
 * @return {String} The formatted value.
 */
String.prototype.format = function() {
    // sets the string value as the current
    // instance value
    var stringValue = this;

    // iterates over all the arguments length for
    // string replacement
    for (var index = 0; index < arguments.length; index++) {
        // replaces the string value for the template value
        stringValue = stringValue.replace("{" + index + "}", arguments[index]);
    }

    // returns the string value
    return stringValue;
}

/**
 * Formats the string with the given options.
 *
 * @param {Map}
 *            optionsMap The map with the formatting options.
 * @return {String} The formatted string value.
 */
String.prototype.formatOptions = function(optionsMap) {
    // in case the options map is not defined
    if (!optionsMap) {
        // returns immediately
        return this;
    }

    // creates a new string buffer
    var stringBuffer = new StringBuffer();

    // sets the initial current index
    var currentIndex = 0;

    // iterates indefinitely to format the various
    // matched according to the current regex
    while (true) {
        // exec the options regex against the string value
        // retrieving the match result and in case the result
        // is not valid breaks the current loop
        var matchResult = this.optionsRegex.exec(this);
        if (matchResult === null) {
            break;
        }

        // retrieves the option start index
        var optionStartIndex = matchResult.index;

        // retrieves the option end index
        var optionEndIndex = this.optionsRegex.lastIndex;

        // retrieves the option value from the match result
        var optionValue = matchResult[0].slice(1);

        //retrieves the previous part string
        var previousPartString = this.slice(currentIndex, optionStartIndex);

        // appends the previous part string to the string buffer
        stringBuffer.append(previousPartString);

        // retrieves the real option value, converts
        // the real option into string and then appends
        // it to the string buffer
        var realOptionValue = optionsMap[optionValue];
        var realOptionValueString = String(realOptionValue);
        stringBuffer.append(realOptionValueString);

        // sets the current index as the option end index plus one
        currentIndex = optionEndIndex + 1;
    }

    // retrieves the last part string
    var lastPartString = this.slice(currentIndex);

    // writes the last part string to the string buffer
    stringBuffer.append(lastPartString);

    // retrieves the string value from the string buffer and
    // returns it as the result for the current method
    var stringValue = stringBuffer.toString();
    return stringValue;
}

/**
 * Formats the current string according to the c language standard template
 * format (provides backward compatability).
 *
 * @return {String} The formatted string according to the standard c template
 *         format.
 */
String.prototype.formatC = function() {
    // sets the string value as the current
    // instance value, uses the current context
    var stringValue = this;

    // iterates over all the arguments present to be
    // able to replace them in the target string
    for (var index = 0; index < arguments.length; index++) {
        // replaces the string value for the template value
        // this assumes that the value is a string value
        stringValue = stringValue.replace("%s", arguments[index]);
    }

    // returns the now replaced string value to the
    // caller method to be used as formatted
    return stringValue;
}

/**
 * Capitalizes the string value.
 *
 * @return {String} The capitalized string.
 */
String.prototype.capitalize = function(local) {
    var f = function(a) {
        return a.charAt(0).toUpperCase() + a.substr(1);
    };

    return local ? f(this) : this.replace(/[\u00bf-\u1fff\u2c00-\uD7FF\w]+/g, f);
}

/**
 * Decapitalizes the string value.
 *
 * @return {String} The decapitalized string.
 */
String.prototype.decapitalize = function(local) {
    var f = function(a) {
        return a.charAt(0).toLowerCase() + a.substr(1);
    };

    return local ? f(this) : this.replace(/[\u00bf-\u1fff\u2c00-\uD7FF\w]+/g, f);
}

/**
 * Encodes the string into utf.
 *
 * @return {String} The encoded string.
 */
String.prototype.encodeUtf = function() {
    var string = this.replace(/\r\n/g, "\n");
    var utfString = "";

    for (var index = 0; index < string.length; index++) {
        var character = string.charCodeAt(index);

        if (character < 128) {
            utfString += String.fromCharCode(character);
        } else if ((character > 127) && (character < 2048)) {
            utfString += String.fromCharCode((character >> 6) | 192);
            utfString += String.fromCharCode((character & 63) | 128);
        } else {
            utfString += String.fromCharCode((character >> 12) | 224);
            utfString += String.fromCharCode(((character >> 6) & 63) | 128);
            utfString += String.fromCharCode((character & 63) | 128);
        }
    }

    return utfString;
}

/**
 * Decodes the string from utf.
 *
 * @return {String} The decoded string.
 */
String.prototype.decodeUtf = function() {
    var string = "";
    var index = 0;
    var character = 0;
    var character1 = 0;
    var character2 = 0;

    while (index < this.length) {
        character = this.charCodeAt(index);

        if (character < 128) {
            string += String.fromCharCode(character);
            index++;
        } else if ((character > 191) && (character < 224)) {
            character1 = this.charCodeAt(index + 1);
            string += String.fromCharCode(((character & 31) << 6) | (character1 & 63));
            index += 2;
        } else {
            character1 = this.charCodeAt(index + 1);
            character2 = this.charCodeAt(index + 2);
            string += String.fromCharCode(((character & 15) << 12) | ((character1 & 63) << 6) | (character2 & 63));
            index += 3;
        }
    }

    return string;
}
