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

StackTrace = StackTrace || {};

/**
 * The default complete stack value.
 *
 * @type Boolean
 */
StackTrace.DEFAULT_COMPLETE_STACK_VALUE = false;

/**
 * Retrieves the stack trace for the current state.
 *
 * @param {Boolean}
 *            completeStack Defines if the stack should be complete (function
 *            contents) or not.
 * @return {List} The result list with the stack trace.
 */
StackTrace.getStackTrace = function() {
    // sets the complete stack value
    var completeStack = completeStack ? completeStack : StackTrace.DEFAULT_COMPLETE_STACK_VALUE;

    // starts the result list
    var result = [];

    try {
        // tries to acess an attribute in an undefined value to raise an exception
        invalid.invalid;
    } catch (exception) {
        // parses the error stack using the given exception
        var stack = StackTrace.parseErrorStack(exception, completeStack);

        // iterates over the stack list
        for (var i = 1; i < stack.length; i++) {
            // appends the stack item to the result list
            result.push(stack[i]);
        }
    }

    // returns the result list
    return result;
}

/**
 * Retrieves the stack trace (as a string) for the current state.
 *
 * @param {Boolean}
 *            completeStack Defines if the stack should be complete (function
 *            contents) or not.
 * @return {String} The result string with the stack trace.
 */
StackTrace.getStackTraceString = function(completeStack) {
    // sets the complete stack value
    var completeStack = completeStack ? completeStack : StackTrace.DEFAULT_COMPLETE_STACK_VALUE;

    // retrieves the stack trace result
    var result = StackTrace.getStackTrace(completeStack);

    // creates the stack string as a join of the result
    var stackTraceString = result.join("\n")

    // returns the stack trace string
    return stackTraceString;
}

/**
 * Parses the error stack from the given exception.
 *
 * @param {Exception}
 *            exception The exception to be parsed to retrieve the error stack.
 * @param {Boolean}
 *            completeStack Defines if the stack should be complete (function
 *            contents) or not.
 * @return {List} The error stack list.
 */
StackTrace.parseErrorStack = function(exception, completeStack) {
    // sets the complete stack value
    var completeStack = completeStack ? completeStack : StackTrace.DEFAULT_COMPLETE_STACK_VALUE;

    // starts the stack list
    var stack = [];

    // in case there is no exception defined
    if (!exception) {
        return stack;
    }

    // in case there is an exception stack defined (firefox)
    if (exception.stack) {
        // splits the stack list in the new line character
        var stackList = exception.stack.split("\n");

        // iterates over all the element of the stack list
        for (var i = 0; i < stackList.length - 1; i++) {
            // retrieves the function value
            var functionValue = stackList[i];

            // retrieves the symbol name
            var name = functionValue.match(/^(\w*)/)[1];

            // in case the symbol name is not defined
            if (!name) {
                // sets the symbol name as anonymous
                name = "anonymous";
            }

            stack[stack.length] = name;
        }
    }
    // in case there is no exception stack defined (webkit and ie)
    else {
        // sets the initial the current function
        var currentFunction = arguments.callee.caller;

        // while there is a valid current function defined
        while (currentFunction) {
            // retrieves the function value
            var functionValue = currentFunction.toString();

            // in case the stack should be complete
            if (completeStack) {
                // adds the function value to the stack
                stack.push(functionValue);
            } else {
                // retrieves the symbol name
                var name = functionValue.substring(
                    functionValue.indexOf("function") + 8,
                    functionValue.indexOf("("));

                // in case the symbol name is not valid
                if (name === " ") {
                    // sets the symbol name as anonymous
                    name = "anonymous";
                }

                // retrieves the function argument names
                var functionArguments = currentFunction.argumentNames();

                // creates the arguments string joining all the arguments
                // in the function arguments list
                var argumentsString = functionArguments.join(",");

                // creates the function string
                var functionString = name + "(" + argumentsString + ")";

                // adds the function string to the stack
                stack.push(functionString);
            }

            // sets the new current function
            currentFunction = currentFunction.caller;
        }
    }

    // returns the stack
    return stack;
}
