// Hive Colony Framework
// Copyright (C) 2008 Hive Solutions Lda.
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
// __revision__  = $LastChangedRevision: 1577 $
// __date__      = $LastChangedDate: 2009-02-24 12:39:05 +0000 (Ter, 24 Fev 2009) $
// __copyright__ = Copyright (c) 2008 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

/**
 * @fileoverview This file contains code to redirect firebug log statements to
 *               the main logger when firebug is not present.
 *
 * @author Tiago Silva <tsilva@hive.pt>
 * @version 1.0.0
 */

if (window.console == null) {
    window.console = new function() {
        this.log = function(str) {
            var logger = log4javascript.getLogger("main");
            logger.info(str);
        };

        this.dir = function(str) {
        };

        this.info = function(str) {
            var logger = log4javascript.getLogger("main");
            logger.info(str);
        };

        this.warn = function(str) {
            var logger = log4javascript.getLogger("main");
            logger.warn(str);
        };

        this.error = function(str) {
            var logger = log4javascript.getLogger("main");
            logger.error(str);
        };
    };
}
