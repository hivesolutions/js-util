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

var String = String || {};

/**
 * Initializes the string size system.
 */
String.stringSizeInit = function() {
    jQuery(document.body).append("<span id=\"ruler\"></span>");
    jQuery("#ruler").css("visibility", "hidden");
    jQuery("#ruler").css("white-space", "nowrap");
}

/**
 * Returns the visual width and height (in pixels) of a string for the given
 * font type and font size.
 *
 * @param {String}
 *            fontType The font type of the string to be measured.
 * @param {Integer}
 *            fontSize The font size (in points) of the string to be measured.
 * @return {List} The visual width and height (in pixels) of the string for the
 *         given font type and font size.
 */
String.prototype.visualSize = function(fontType, fontSize) {
    // retrieves the ruler
    var ruler = jQuery("#ruler");

    // retrieves the ruler in native mode
    var rulerNative = jQuery("ruler");

    if (fontType)
        ruler.css("font-family", fontType)

    if (fontSize)
        ruler.css("font-size", fontSize + "pt");

    // sets the inner html of the ruler
    rulerNative.innerHTML = this;

    // returns the offset width and height of the ruler
    return [rulerNative.offsetWidth, rulerNative.offsetHeight];
}

// initializes the string size system
String.stringSizeInit();
