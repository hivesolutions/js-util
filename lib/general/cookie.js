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

var _global = typeof global === "undefined" ? window : global;
var Cookie = (_global._Cookie = _global.Cookie || {});

/**
 * Constructor of the class.
 */
Cookie = function(name) {
    this.name = name || null;
    this.value = null;
    this.timeoutTime = null;
    this.secure = false;
};

/**
 * Saves the cookie serializing it into the browser native form.
 */
Cookie.prototype.save = function() {
    // retrieves the cookie attributes
    var cookieName = this.name;
    var cookieValue = this.value;
    var cookieTimeoutTime = this.timeoutTime;
    var cookieDomain = this.secure;
    var cookieSecure = this.secure;

    // creates the cookie final value
    var cookieFinalValue =
        cookieName +
        "=" +
        escape(cookieValue) +
        (cookieTimeoutTime ? ";expires=" + new Date(cookieTimeoutTime * 1000).toUTCString() : "") +
        (cookieDomain ? ";domain=" + cookieDomain : "") +
        (cookieSecure ? ";secure" : "");

    // sets the cookie final value in the document
    document.cookie = cookieFinalValue;
};

/**
 * Loads the current cookie from the cookie storage, using the cookie name as
 * reference for the loading process.
 *
 * @param {String} cookie If provided overrides the default provider of the
 * cookie (from the document).
 * @return {Boolean} The result of the loading.
 */
Cookie.prototype.load = function(cookie) {
    // tries to retrieve the default cookie string value
    // that is going to be parsed
    cookie = cookie || document.cookie;

    // retrieves the cookies list, by splitting the
    // list arround the typical character
    var cookiesList = cookie.split(";");

    // sets the cookie found flag
    var cookieFound = false;

    // iterates over all the cookies in the list of
    // cookies retrieves from the string
    for (var index = 0; index < cookiesList.length; index++) {
        // retrives the reference to the current value
        // (cookie) in iteration
        var value = cookiesList[index];

        // splits the cookie value to get the name and the value
        var cookieSplitted = value.split("=");

        // tims left/right whitespace in the cookie name
        var cookieName = cookieSplitted[0].replace(/^\s+|\s+$/g, "");

        // in case it's the same cookie name
        if (cookieName === this.name) {
            // sets the cookie found flag
            cookieFound = true;

            // in case there is a valid cookie value
            if (cookieSplitted.length > 1) {
                this.value = unescape(cookieSplitted[1].replace(/^\s+|\s+$/g, ""));
            }

            // breaks the current loop
            break;
        }
    }

    return cookieFound;
};

/**
 * Retrieves the name.
 *
 * @return {String} The name.
 */
Cookie.prototype.getName = function() {
    return this.name;
};

/**
 * Sets the name.
 *
 * @param {String}
 *            name The name.
 */
Cookie.prototype.setName = function(name) {
    this.name = name;
};

/**
 * Retrieves the value.
 *
 * @return {String} The value.
 */
Cookie.prototype.getValue = function() {
    return this.value;
};

/**
 * Sets the value.
 *
 * @param {String}
 *            value The value.
 */
Cookie.prototype.setValue = function(value) {
    this.value = value;
};

/**
 * Retrieves the timeout time.
 *
 * @return {Date} The timeout time.
 */
Cookie.prototype.getTimeoutTime = function() {
    return this.timeoutTime;
};

/**
 * Sets the timeout time.
 *
 * @param {Date}
 *            timeoutTime The timeout time.
 */
Cookie.prototype.setTimeoutTime = function(timeoutTime) {
    this.timeoutTime = timeoutTime;
};

/**
 * Retrieves the domain.
 *
 * @return {String} The domain.
 */
Cookie.prototype.getDomain = function() {
    return this.domain;
};

/**
 * Sets the domain.
 *
 * @param {String}
 *            domain The domain.
 */
Cookie.prototype.setDomain = function(domain) {
    this.domain = domain;
};

/**
 * Retrieves the secure.
 *
 * @return {String} The secure.
 */
Cookie.prototype.getSecure = function() {
    return this.secure;
};

/**
 * Sets the secure.
 *
 * @param {String}
 *            secure The secure.
 */
Cookie.prototype.setSecure = function(secure) {
    this.secure = secure;
};

if (typeof module !== "undefined") {
    module.exports = {
        Cookie: Cookie
    };
}
