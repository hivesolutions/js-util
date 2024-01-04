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
var Object = (_global.Object = _global.Object || {});

Object.isEmpty = function(object) {
    for (var property in object) {
        if (object[property] !== undefined) {
            return false;
        }
    }
    return true;
};

Object.clone = function(object, recursive) {
    if (object === null || object === undefined || typeof object !== "object") {
        return object;
    }
    var cloned = new object.constructor();
    for (var key in object) {
        var value = object[key];
        value = recursive ? Object.clone(value) : value;
        cloned[key] = value;
    }
    return cloned;
};

if (typeof module !== "undefined") {
    module.exports = {
        Object: Object
    };
}
