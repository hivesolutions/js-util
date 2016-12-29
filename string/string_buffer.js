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

var StringBuffer = StringBuffer || {};

/**
 * Constructor of the class.
 */
function StringBuffer() {
    // creates the buffer to hold the (partial) strings
    this.buffer = [];
}

/**
 * Clears the current string buffer
 *
 * @return {Object} The current context.
 */
StringBuffer.prototype.clear = function(string) {
    // creates a new buffer, simulating the clearing of the previous
    this.buffer = [];

    // returns the context
    return this;
}

/**
 * Adds a string to the string buffer.
 *
 * @param {String}
 *            string The string to be added to the buffer.
 * @return {Object} The current context.
 */
StringBuffer.prototype.append = function(string) {
    // adds the string to the buffer
    this.buffer.push(string);

    // returns the context
    return this;
}

/**
 * Adds a string to the string buffer (in the first place).
 *
 * @param {String}
 *            string The string to be added to the buffer.
 * @return {Object} The current context.
 */
StringBuffer.prototype.prepend = function(string) {
    // adds the string to the buffer in the first place
    this.buffer = [string].concat(this.buffer);

    // returns the context
    return this;
}

/**
 * Updates the buffer to a "new" buffer with the given value.
 *
 * @param {String}
 *            string The string to be used in the creation of the "new" buffer.
 * @return {Object} The current context.
 */
StringBuffer.prototype.replace = function(string) {
    // clears the read buffer
    this.clear();

    // adds the string to the read buffer
    this.append(string);

    // returns the context
    return this;
}

/**
 * Removes the last added string.
 *
 * @return {Object} The current context.
 */
StringBuffer.prototype.removeLastAppend = function() {
    // sets the last element as not valid (empty)
    // and returns the current (self) context
    this.buffer[this.buffer.size() - 1] = "";
    return this;
}

/**
 * Tests if the string buffer is empty.
 *
 * @return {Boolean} If the string buffer is empty.
 */
StringBuffer.prototype.empty = function() {
    return this.buffer.length == 0;
}

/**
 * Converts the internal string buffer to a string.
 *
 * @return {String} The converted string value.
 */
StringBuffer.prototype.toString = function() {
    // returns the joined value of the strings
    // in the buffer
    return this.buffer.join("");
}
