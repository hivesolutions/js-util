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
var Array = (_global.Array = _global.Array || {});

if (typeof Array.prototype.indexOf === "undefined") {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = start || 0, j = this.length; i < j; i++) {
            if (this[i] === obj) {
                return i;
            }
        }
        return -1;
    };
}

if (typeof Array.prototype.indexOfObject === "undefined") {
    Array.prototype.indexOfObject = function(obj) {
        var isObject = typeof obj === "object";
        if (!isObject) {
            return this.indexOf(obj);
        }

        for (var index = 0; index < this.length; index++) {
            var valid = true;
            var _obj = this[index];

            for (var key in obj) {
                var value = obj[key];
                var _value = _obj[key];
                if (value === _value) {
                    continue;
                }
                valid = false;
                break;
            }

            if (!valid) {
                continue;
            }

            return index;
        }

        return -1;
    };
}

if (typeof Array.prototype.isIn === "undefined") {
    Array.prototype.isIn = function(obj) {
        return this.indexOf(obj) !== -1;
    };
}

if (typeof module !== "undefined") {
    module.exports = {
        Array: Array
    };
}
