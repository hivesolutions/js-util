// Hive Colony Framework
// Copyright (c) 2008-2018 Hive Solutions Lda.
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
// __copyright__ = Copyright (c) 2008-2018 Hive Solutions Lda.
// __license__   = Apache License, Version 2.0

var _global = typeof global === "undefined" ? window : global;
var BrowserDetect = BrowserDetect || _global.BrowserDetect || {};
var navigator = navigator || _global.navigator || {};
var window = window || _global || {};

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
    // in case the provided data string is not a valid one
    // returns an invalid value immediately
    if (!dataString) {
        return null;
    }

    // tries to search for the version search string
    var index = dataString.indexOf(BrowserDetect.versionSearchString);

    // in case the version search string is not found
    // returns immediately, no version could be detected
    if (index === -1) {
        return null;
    }

    // returns the float version of the discovered number
    // string in the "middle" of the data string
    return parseFloat(dataString.substring(index + BrowserDetect.versionSearchString.length + 1));
};

BrowserDetect.DATA_BROWSER = [{
    string: navigator.userAgent,
    identity: "Edge",
    subString: "Edge",
    versionSearch: "Edge"
}, {
    string: navigator.userAgent,
    identity: "Chrome",
    subString: "Chrome"
}, {
    string: navigator.userAgent,
    identity: "OmniWeb",
    subString: "OmniWeb",
    versionSearch: "OmniWeb/"
}, {
    string: navigator.vendor,
    identity: "Safari",
    subString: "Apple",
    versionSearch: "Version"
}, {
    prop: window.opera,
    identity: "Opera"
}, {
    string: navigator.vendor,
    identity: "iCab",
    subString: "iCab"
}, {
    string: navigator.vendor,
    identity: "Konqueror",
    subString: "KDE"
}, {
    string: navigator.userAgent,
    identity: "Firefox",
    subString: "Firefox"
}, {
    string: navigator.vendor,
    identity: "Camino",
    subString: "Camino"
}, {
    string: navigator.userAgent,
    identity: "Netscape",
    subString: "Netscape"
}, {
    string: navigator.userAgent,
    identity: "Explorer",
    subString: "MSIE",
    versionSearch: "MSIE"
}, {
    string: navigator.userAgent,
    identity: "Explorer",
    subString: "Trident",
    versionSearch: "rv"
}, {
    string: navigator.userAgent,
    identity: "Mozilla",
    subString: "Gecko",
    versionSearch: "rv"
}, {
    string: navigator.userAgent,
    identity: "Netscape",
    subString: "Mozilla",
    versionSearch: "Mozilla"
}];

BrowserDetect.DATA_OS = [{
    string: navigator.platform,
    identity: "Windows",
    subString: "Win"
}, {
    string: navigator.platform,
    identity: "Mac",
    subString: "Mac"
}, {
    string: navigator.userAgent,
    identity: "iPhone/iPod",
    subString: "iPhone"
}, {
    string: navigator.platform,
    identity: "Linux",
    subString: "Linux"
}];

// initializes the browser detection system
BrowserDetect();

if (typeof module !== "undefined") {
    module.exports = {
        BrowserDetect: BrowserDetect
    };
}
