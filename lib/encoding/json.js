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

Json = typeof Json === "undefined" ? {} : Json;

/**
 * Escapes a character.
 */
Json.escapeChar = function() {
    // the escape characters list
    var escapeChars = ["\b", "\t", "\n", "\f", "\r"];

    // the escape characters map
    var escapeCharsMap = {
        "\b": "b",
        "\t": "t",
        "\n": "n",
        "\f": "f",
        "\r": "r"
    };

    return function(character) {
        // need to do these first as their ascii values are > 32 (34 & 92)
        if (character === "\"" || character === "\\") {
            return "\\" + character;
        }

        // otherwise it doesn't need escaping
        if (character.charCodeAt(0) >= 32) {
            return character;
        }

        // retrieves the escape character substitution
        var escapeCharacterSubstitution = escapeCharsMap[character];

        // in case there is a valid escape character substitution
        if (escapeCharacterSubstitution)
            return "\\" + escapeCharacterSubstitution;

        // it was a character from 0-31 that wasn't one of the escape chars
        return character;
    };
}();

/**
 * Encodes a string into json format.
 *
 * @param {String}
 *            stringValue The string value to be encoded into json format.
 * @return {String} The string value encoded in json format.
 */
Json.escapeString = function(stringValue) {
    // rather inefficient way to do it
    var parts = stringValue.split("");

    for (var index = 0; index < parts.length; index++) {
        parts[index] = Json.escapeChar(parts[index]);
    }

    return "\"" + parts.join("") + "\"";
};

/**
 * Converts the given object into a json string.
 *
 * @param {Object}
 *            object The object to be converted into a json string.
 * @return {String} The resulting json string.
 */
Json.toString = function(object) {
    // retrieves the type of the object
    var objectType = typeof(object);

    // in case the object is not of type object
    // or in case it is null
    if (objectType !== "object" || object === null || object === undefined) {
        // simple data type
        if (objectType === "string") {
            object = Json.escapeString(object);
        }

        // returns the string value of the object
        return String(object);
    } else {
        // allocates the internal variables
        var element;
        var elementValue;
        var elementValueType;

        // creates the list to hold the json elements
        var jsonElementsList = [];

        // checks if the object is of type array
        var isArray = (object && object.constructor === Array);

        // iterates over all the object
        // properties
        for (element in object) {
            // retrieves the element value
            elementValue = object[element];

            // retrieves the element value type
            elementValueType = typeof(elementValue);

            // in case the element if of type string
            if (elementValueType === "string") {
                elementValue = Json.escapeString(elementValue);
            }
            // in case the element is of type object and not null
            else if (elementValueType === "object" && elementValue !== null && elementValue !== undefined) {
                // retrieves the element value as the json
                // value of the element
                elementValue = Json.toString(elementValue);
            }

            // adds the element to the json elements list
            jsonElementsList.push((isArray ? "" : "\"" + element + "\":") + String(elementValue));
        }

        return (isArray ? "[" : "{") + String(jsonElementsList) + (isArray ? "]" : "}");
    }
};

/**
 * Converts the given json string into an object.
 *
 * @param {String}
 *            stringValue The json string to be used in conversion.
 * @return {Object} The resulting object.
 */
Json.fromString = function(stringValue) {
    // in case the string value is
    // empty (invalid)
    if (stringValue === "") {
        // returns empty string value
        stringValue = "\"\"";
    }

    // evaluates the json value
    eval("var evaluatedValue=" + stringValue + ";");

    // returns the evaluated value
    return evaluatedValue;
};

if (typeof module !== "undefined") {
    module.exports = {
        Json: Json
    };
}
