// Hive Colony Framework
// Copyright (C) 2008-2015 Hive Solutions Lda.
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

// __author__    = Tiago Silva <tsilva@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2015 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

var ClassReference = ClassReference || {};

/**
 * Returns the class reference correspondent to the provided class name.
 *
 * @param {String}
 *            className Name of the class.
 * @return {Class} Class reference.
 */
ClassReference.getClassReference = function(className) {
    // splits the class name
    var nameTokens = className.split(".");

    // retrieves the initial reference (the window)
    var reference = window;

    // starts the token value
    var tokenValue = null;

    // iterates over the tokens lenght
    for (var offset = 0; offset < nameTokens.length; offset++) {
        // retrieves the current token value
        tokenValue = nameTokens[offset];

        // updates the current reference
        reference = reference[tokenValue];
    }

    // returns the reference
    return reference;
}
