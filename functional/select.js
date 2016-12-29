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

var Select = Select || {};

Select.map = function(list, _function) {
    // starts the result list as an
    // empty list
    var result = [];

    // iterates over all the
    for (var index = 0; index < list.length; index++) {
        // retrieves the current item from the
        // list (item to be mapped)
        var item = list[index];

        // maps the item using the map function and
        // retrieving the mapped item
        var _item = _function(item);

        // adds the (mapped) item to the result
        // items list
        result.push(_item);
    }

    // returns the list of mapped items
    return result;
}

Select.reduce = function(list, _function) {
    // starts the accumulator with the first
    // element in the list
    var accumulator = list[0];

    // iterates over the (remaining) list elements
    for (var index = 1; index < list.length; index++) {
        // retrieves the current item from the
        // the list
        var item = list[index];

        // calls the reduce function with the current
        // accumulator value and the item, retrieving
        // the "new" accumulator value
        accumulator = _function(accumulator, item);
    }

    // returns the (final) accumulator
    return accumulator;
}

Select.floatValue = function(selector, zerify, defaultValue) {
    // retrieves the element using the
    // given selector
    var element = jQuery(selector);

    // retrieves the float value for the element
    var valueFloat = Select._floatValue(element, zerify, defaultValue);

    // returns the value as float
    return valueFloat;
}

Select.floatValues = function(selector, zerify, defaultValue) {
    // retrieves the element using the
    // given selector
    var element = jQuery(selector);

    // creates the list of value floats
    var valueFloats = [];

    // iterates over all the selected elements
    // to convert their value to float
    element.each(function(index, element) {
        // retrieves the element reference
        var _element = jQuery(element);

        // retrieves the float value for the element
        var valueFloat = Select._floatValue(_element, zerify,
            defaultValue);

        // adds the value float to the list
        // of value floats
        valueFloats.push(valueFloat);
    });

    // returns the values as floats
    return valueFloats;
}

Select.sum = function(firstSelector, secondSelector, decimalPlaces, defaultValue) {
    // retrieves the first and second values
    var firstValue = Select.floatValue(firstSelector, true);
    var secondValue = Select.floatValue(secondSelector, true);

    // calculates the value and normalizes it
    var value = firstValue + secondValue;
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the calculated value
    return value;
}

/**
 * Sums the various float values resulting from the given selector string. The
 * sum is made using a reduce strategy over a list of elements.
 *
 * @param {String}
 *            selector The string describing the elements to be selected for the
 *            operation.
 * @param {Integer}
 *            decimalPlaces The number of decimal places to be used in the final
 *            number (the value is rounded accordingly).
 * @param {String}
 *            defaultValue The default value to be returned in case no valid
 *            value is calculated.
 * @return {Float} The resulting float value from the sum.
 */
Select.sums = function(selector, decimalPlaces, defaultValue) {
    // retrieves the sum value by adding all the partial values
    var value = Select.reduce(Select.floatValues(selector),
        function(accumulator, item) {
            // "zerifies" the item value (avoids)
            // avoids "extra" erroneous values
            item = isNaN(item) ? 0 : item;

            // returns the addition of the accumulator
            // and the item
            return accumulator + item;
        });

    // normalizes the value according to the given decimal places
    // and default value
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the (reduced) value
    return value;
}

Select.subtract = function(firstSelector, secondSelector, decimalPlaces, defaultValue) {
    // retrieves the first and second values
    var firstValue = Select.floatValue(firstSelector, true);
    var secondValue = Select.floatValue(secondSelector, true);

    // calculates the value and normalizes it
    var value = firstValue - secondValue;
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the calculated value
    return value;
}

/**
 * Subtracts the various float values resulting from the given selector string.
 * The subtraction is made using a reduce strategy over a list of elements.
 *
 * @param {String}
 *            selector The string describing the elements to be selected for the
 *            operation.
 * @param {Integer}
 *            decimalPlaces The number of decimal places to be used in the final
 *            number (the value is rounded accordingly).
 * @param {String}
 *            defaultValue The default value to be returned in case no valid
 *            value is calculated.
 * @return {Float} The resulting float value from the subtraction.
 */
Select.subtracts = function(selector, decimalPlaces, defaultValue) {
    // retrieves the subtraction value by adding all the partial values
    var value = Select.reduce(Select.floatValues(selector),
        function(accumulator, item) {
            // "zerifies" the item value (avoids)
            // avoids "extra" erroneous values
            item = isNaN(item) ? 0 : item;

            // returns the subtraction of the accumulator
            // and the item
            return accumulator - item;
        });

    // normalizes the value according to the given decimal places
    // and default value
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the (reduced) value
    return value;
}

Select.multiply = function(firstSelector, secondSelector, decimalPlaces, defaultValue) {
    // retrieves the first and second values
    var firstValue = Select.floatValue(firstSelector, true, 0);
    var secondValue = Select.floatValue(secondSelector, true, 0);

    // calculates the value and normalizes it
    var value = firstValue * secondValue;
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the calculated value
    return value;
}

Select.multiplys = function(selector, decimalPlaces, defaultValue) {
    // retrieves the multiplication value by multiplying
    // all the partial values
    var value = Select.reduce(Select.floatValues(selector),
        function(accumulator, item) {
            // "zerifies" the item value (avoids)
            // avoids "extra" erroneous values
            item = isNaN(item) ? 1 : item;

            // returns the multiplication of the accumulator
            // and the item
            return accumulator * item;
        });

    // normalizes the value according to the given decimal places
    // and default value
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the (reduced) value
    return value;
}

Select.divide = function(firstSelector, secondSelector, decimalPlaces, defaultValue) {
    // retrieves the first and second values
    var firstValue = Select.floatValue(firstSelector, true, 0);
    var secondValue = Select.floatValue(secondSelector, true, 1);

    // calculates the value and normalizes it
    var value = firstValue / secondValue;
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the calculated value
    return value;
}

Select.divides = function(selector, decimalPlaces, defaultValue) {
    // retrieves the division value by dividing
    // all the partial values
    var value = Select.reduce(Select.floatValues(selector),
        function(accumulator, item) {
            // "zerifies" the item value (avoids)
            // avoids "extra" erroneous values
            item = isNaN(item) ? 1 : item;

            // returns the division of the accumulator
            // and the item
            return accumulator / item;
        });

    // normalizes the value according to the given decimal places
    // and default value
    value = Select._normalizeValue(value, decimalPlaces, defaultValue);

    // returns the (reduced) value
    return value;
}

/**
 * Retrieves a valid float value for the given element. A simple heurisitc is
 * used to determine the correct value to be used in the parsing.
 *
 * An optional zerify flag may be set so that invalid number values are
 * converted to zero.
 *
 * @param {Element}
 *            element The element to be used to retrieve the representation
 *            float value.
 * @param {Boolean}
 *            zerify If the value must be zerified in case an invalid number is
 *            parsed.
 * @param {Float}
 *            defaultValue The default float number value to be used in case the
 *            the zerification process is set.
 * @return {Float} The retrieved and parsed float value for the element.
 */
Select._floatValue = function(element, zerify, defaultValue) {
    // in case the element is itself already
    // a value no need to process it
    if (element.length == 1 && !isNaN(element[0])) {
        // returns the element
        // as the float value (it's a number)
        return element[0];
    }

    // retrieves the value from the element
    // and parses it as an float
    var value = element.val();
    var valueFloat = parseFloat(value);

    // in case the float parse was successfull
    // the found value should be valid
    if (!isNaN(valueFloat)) {
        // returns the float value
        return valueFloat;
    }

    // retrieves the value from the element
    // and parses it as an float
    var value = element.html();
    var valueFloat = parseFloat(value);

    // in case the zerify flag is set, the number
    // must be checked to be a valid number to be
    // "casted" in case it's not
    if (zerify) {
        // "casts" the value into zero (or default value) in
        // case the parsed value is not a valid float number
        valueFloat = isNaN(valueFloat) ? (defaultValue === undefined ? 0 : defaultValue) : valueFloat;
    }

    // returns the float value
    return valueFloat;
}

Select._normalizeValue = function(value, decimalPlaces, defaultValue) {
    // calculates the rounder value from the number of decimal places
    // in case they're defined
    var rounder = decimalPlaces ? Math.pow(10, decimalPlaces) : 0;

    // rounds the value in case the number of decimal places
    // value is defined
    value = decimalPlaces ? (Math.round(value * rounder) / rounder).toFixed(decimalPlaces) : value;

    // in case the value is not valid (not a number)
    // sets the default value
    if (isNaN(value)) {
        // sets the default value in the value in case it's defined
        value = defaultValue ? defaultValue : "N/A";
    }

    // returns the (normalized) value
    return value;
}
