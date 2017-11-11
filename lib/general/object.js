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
var _Object = _Object || _global._Object || {};

/**
 * Retrieves an element from the given object for the given key, in case the
 * element is not found the default value is returned.
 *
 * @param {Object}
 *            object The object to be used to retrieve the element.
 * @param {String}
 *            key The index key to be used in the retrieval.
 * @param {Object}
 *            defaultValue The default value to be returned in case no element
 *            is found.
 * @return {Object} The retrieved element.
 */
_Object.get = function(object, key, defaultValue) {
    // tries to retrieve the value
    var value = object[key];

    // returns the valid value
    return value !== null && value !== undefined ? value : defaultValue;
}

/**
 * Creates a new constructor for the given base constructor and base class. The
 * inheritance process changes the given class prototype references.
 *
 * @param {Function}
 *            constructorFunction The base constructor function to be used.
 * @param {Class}
 *            baseClass The base class to inherit from.
 * @return {Function} The newly created constructor / class.
 */
_Object.inherit = function(constructorFunction, baseClass) {
    var targetClass = function() {
        // creates the base element
        this.base = new baseClass();

        // call the constructor function
        constructorFunction.apply(this, arguments)
    };

    // iterates over all the elements of the base class prototype
    for (var element in baseClass.prototype) {
        // creates the current element in the target class
        this.createElement(targetClass, baseClass, element);
    }

    // returns the target class (constructor)
    return targetClass;
}

/**
 * Creates an element in the target class. The new element references the
 * element in the base class.
 *
 * @param {Class}
 *            targetClass The target class to be used.
 * @param {Class}
 *            baseClass The base class to be used.
 * @param {String}
 *            element The name of the element to be created.
 */
_Object.createElement = function(targetClass, baseClass, element) {
    // in case the element is invalid
    if (!element || !baseClass.prototype[element]) {
        // returns immediately
        return;
    }

    // retrieves the base fnction for the current element
    var baseFunction = baseClass.prototype[element];

    targetClass.prototype[element] = function() {
        return baseFunction.apply(this, arguments)
    }
}

/**
 * Extends the given object with the given extension object.
 *
 * @param {Object}
 *            object The base object to be used.
 * @param {Object}
 *            extensionObject The object ot be used to extend the base one.
 * @return {Object} The resulting object.
 */
_Object.extend = function(object, extensionObject) {
    // allocates the space for the value
    var value;

    // allocates the new object map
    var newObject = {}

    // iterates over all the keys in the
    // base object
    for (var key in object) {
        // retrieves the value
        var value = object[key];

        // sets the value in the new object
        newObject[key] = value;
    }

    // iterates over all the keys in
    // the extension object
    for (var key in extensionObject) {
        // retrieves the value
        var value = extensionObject[key];

        // sets the value in the new object
        newObject[key] = value;
    }

    // returns the new object
    return newObject;
}

/**
 * Extends the given object with the given extension object. This method uses
 * the base object for the creation of the resulting object.
 *
 * @param {Object}
 *            object The base object to be used.
 * @param {Object}
 *            extensionObject The object ot be used to extend the base one.
 * @return {Object} The resulting object.
 */
_Object._extend = function(object, extensionObject) {
    // allocates the space for the value
    var value;

    // iterates over all the keys in
    // the extension object
    for (var key in extensionObject) {
        // retrieves the value
        var value = extensionObject[key];

        // sets the value in the base object
        object[key] = value;
    }

    // returns the base object as the
    // resulting object
    return object;
}

if (typeof module !== "undefined") {
    module.exports = {
        _Object: _Object
    };
}
