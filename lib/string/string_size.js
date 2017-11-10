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

String = String || {};

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
