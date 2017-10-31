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

var BrowserDetect = BrowserDetect || {};

BrowserDetect = function() {
    BrowserDetect.browser = BrowserDetect.searchString(BrowserDetect.DATA_BROWSER) || "Unknown browser";
    BrowserDetect.version = BrowserDetect.searchVersion(navigator.userAgent) || BrowserDetect.searchVersion(
        navigator.appVersion) || "Unknown version";
    BrowserDetect.os = BrowserDetect.searchString(BrowserDetect.DATA_OS) || "Unknown OS";
};

BrowserDetect.searchString = function(data) {
    for (var index = 0; index < data.length; index++) {
        var dataString = data[index].string;
        var dataProp = data[index].prop;
        BrowserDetect.versionSearchString = data[index].versionSearch || data[index].identity;
        if (dataString) {
            if (dataString.indexOf(data[index].subString) !== -1) {
                return data[index].identity;
            }
        } else if (dataProp) {
            return data[index].identity;
        }
    }
};

BrowserDetect.searchVersion = function(dataString) {
    // tries to search for the version search string
    var index = dataString.indexOf(BrowserDetect.versionSearchString);

    // in case the version search string is not found
    // returns immediately, no version could be detected
    if (index === -1) {
        return;
    }

    // returns the float version of the discovered number
    // string in the "middle" of the data string
    return parseFloat(dataString.substring(index + BrowserDetect.versionSearchString.length + 1));
};

BrowserDetect.DATA_BROWSER = [{
    string: navigator.userAgent,
    subString: "Edge",
    identity: "Edge",
    versionSearch: "Edge"
}, {
    string: navigator.userAgent,
    subString: "Chrome",
    identity: "Chrome"
}, {
    string: navigator.userAgent,
    subString: "OmniWeb",
    versionSearch: "OmniWeb/",
    identity: "OmniWeb"
}, {
    string: navigator.vendor,
    subString: "Apple",
    identity: "Safari",
    versionSearch: "Version"
}, {
    prop: window.opera,
    identity: "Opera"
}, {
    string: navigator.vendor,
    subString: "iCab",
    identity: "iCab"
}, {
    string: navigator.vendor,
    subString: "KDE",
    identity: "Konqueror"
}, {
    string: navigator.userAgent,
    subString: "Firefox",
    identity: "Firefox"
}, {
    string: navigator.vendor,
    subString: "Camino",
    identity: "Camino"
}, {
    string: navigator.userAgent,
    subString: "Netscape",
    identity: "Netscape"
}, {
    string: navigator.userAgent,
    subString: "MSIE",
    identity: "Explorer",
    versionSearch: "MSIE"
}, {
    string: navigator.userAgent,
    subString: "Trident",
    identity: "Explorer",
    versionSearch: "rv"
}, {
    string: navigator.userAgent,
    subString: "Gecko",
    identity: "Mozilla",
    versionSearch: "rv"
}, {
    string: navigator.userAgent,
    subString: "Mozilla",
    identity: "Netscape",
    versionSearch: "Mozilla"
}];

BrowserDetect.DATA_OS = [{
    string: navigator.platform,
    subString: "Win",
    identity: "Windows"
}, {
    string: navigator.platform,
    subString: "Mac",
    identity: "Mac"
}, {
    string: navigator.userAgent,
    subString: "iPhone",
    identity: "iPhone/iPod"
}, {
    string: navigator.platform,
    subString: "Linux",
    identity: "Linux"
}];

// initializes the browser detection system
BrowserDetect();
