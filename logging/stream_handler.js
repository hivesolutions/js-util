// Hive Colony Framework
// Copyright (c) 2008-2016 Hive Solutions Lda.
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
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2016 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

var Logging = Logging || {};

/**
 * Constructor of the class.
 *
 * @param {Object}
 *            stream The stream to be used.
 */
Logging.StreamHandler = function(stream) {
    this.stream = stream ? stream : console;
};

Logging.StreamHandler = _Object.inherit(Logging.StreamHandler, Logging.Handler);

Logging.StreamHandler.prototype.emit = function(record) {
    this.base.emit(record);

    // formats the record retrieving the message
    var message = this.format(record);

    // prints the message to the stream
    this.stream.info(message);

    // flushes the stream
    this.flush();
}
