// Hive Colony Framework
// Copyright (C) 2008-2012 Hive Solutions Lda.
//
// This file is part of Hive Colony Framework.
//
// Hive Colony Framework is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Hive Colony Framework is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Hive Colony Framework. If not, see <http://www.gnu.org/licenses/>.

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate: 2009-09-05 15:27:53 +0100 (sÃ¡b, 05 Set 2009) $
// __copyright__ = Copyright (c) 2008-2012 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

/**
 * The redirector info structure.
 *
 * @type {List}
 */
var redirectorInfo = {};

/**
 * Creates redirector info to allow callbakc redirection.
 *
 * @param {String}
 *            id The id of the redirection element.
 * @param {Function}
 *            callback The function callback.
 * @param {Scope}
 *            context The context of execution.
 * @param {String}
 *            arguments The arguments of the callback.
 * @return {Map} Map containing the redirection informarion.
 */
createRedirectorInfo = function(id, callback, context, arguments) {
    var value = {
        id : id,
        callback : callback,
        context : context,
        arguments : arguments
    };

    redirectorInfo[id] = value;

    return value;
}

/**
 * The redirector function to allow redirection in callback from setTimeout.
 *
 * @param {Function}
 *            callback The function callback.
 * @param {Scope}
 *            context The context of execution.
 * @param {String}
 *            arguments The arguments of the callback.
 */
redirector = function(callback, context, arguments) {
    callback.call(context, arguments);
}
