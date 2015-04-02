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

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2015 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

var Mobile = Mobile || {};

Mobile.touchHandler = function(event) {
    var touches = event.changedTouches;
    var first = touches[0];
    var type = "";

    switch (event.type) {
        case "touchstart" :
            type = "mousedown";
            break;

        case "touchmove" :
            type = "mousemove";
            break;

        case "touchend" :
            type = "mouseup";
            break;

        default :
            return;
    }

    var mouseEvent = document.createEvent("MouseEvent");
    mouseEvent.initMouseEvent(type, true, true, window, 1, first.screenX,
            first.screenY, first.clientX, first.clientY, false, false, false,
            false, 0, null);

    first.target.dispatchEvent(mouseEvent);
};

Mobile.init = function() {
    document.addEventListener("touchstart", Mobile.touchHandler, true);
    document.addEventListener("touchmove", Mobile.touchHandler, true);
    document.addEventListener("touchend", Mobile.touchHandler, true);
    document.addEventListener("touchcancel", Mobile.touchHandler, true);
};

Mobile.init();
