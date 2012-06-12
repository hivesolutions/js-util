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

// __author__    = João Magalhães <joamag@hive.pt>
// __version__   = 1.0.0
// __revision__  = $LastChangedRevision: 4915 $
// __date__      = $LastChangedDate: 2009-09-16 13:09:09 +0100 (qua, 16 Set 2009) $
// __copyright__ = Copyright (c) 2008 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

var TEST_CSS_IMPORT_TIMEOUT = 10;
var TEST_JS_IMPORT_TIMEOUT = 10;

var cssImportsPending = [];
var jsImportsPending = [];
var jsImportsLoaded = [];
var cssLoopingFlag = false;
var jsLoopingFlag = false;

/**
 * The global unique id for the retrieval of the css files.
 *
 * @type Integer
 */
var globalCssUniqueId = 0;

importCss = function(url, name, handler, handlerArguments, context) {
    var tag = document.createElement("link");
    var completeUrl = url + "?id=" + globalCssUniqueId;
    tag.id = url;
    tag.type = "text/css";
    tag.rel = "stylesheet";
    tag.href = completeUrl;
    tag.media = "all";
    document.getElementsByTagName("head")[0].appendChild(tag);

    if (name && name != undefined && handler && handler != undefined) {
        if (BrowserDetect.browser == "Explorer") {
            tag.onreadystatechange = function() {
                /loaded|complete/.test(tag.readyState)
                        && handler.call(context, handlerArguments);
            }
        } else {
            cssImportsPending.push([name, tag, handler, handlerArguments,
                    context]);
        }
    }

    if (!cssLoopingFlag) {
        cssLoopingFlag = true;
        setTimeout("testCssImport()", TEST_CSS_IMPORT_TIMEOUT);
    }

    // increments the global css unique id
    globalCssUniqueId += 1;
}

importReloadCss = function(url, name, handler, handlerArguments, context) {
    // tries to retrieve the old import tag
    var oldImport = document.getElementById(url);

    if (oldImport)
        oldImport.parentNode.removeChild(oldImport);

    importCss(url, name, handler, handlerArguments, context)
}

importScript = function(url, handler, handlerArguments, context) {
    var tag = document.createElement("script");
    tag.id = url;
    tag.type = "text/javascript";
    tag.src = url;
    tag.charset = "ISO-8859-1";

    // in case the browser is the internet explorer
    if (BrowserDetect.browser == "Explorer") {
        if (handler && handler != undefined)
            jsImportsPending.push([url, handler, handlerArguments, context]);

        if (!jsLoopingFlag) {
            jsLoopingFlag = true;
            setTimeout("testJsImport()", TEST_JS_IMPORT_TIMEOUT);
        }
    } else
        tag.onload = function() {
            if (handler && handler != undefined)
                handler.call(context, handlerArguments);
        }

    // retrieves the document body element
    var documentBody = document.body;

    // appends the tag to the document body element
    documentBody.appendChild(tag);
}

importReloadScript = function(url, handler, handlerArguments, context) {
    // tries to retrieve the old import tag
    var oldImport = document.getElementById(url);

    if (oldImport)
        oldImport.parentNode.removeChild(oldImport);

    if (BrowserDetect.browser == "Chrome" || BrowserDetect.browser == "Safari")
        importScriptAjax(url, handler, handlerArguments, context)
    else
        importScript(url, handler, handlerArguments, context)
}

importScriptHead = function(url, handler, handlerArguments, context) {
    var tag = document.createElement("script");
    tag.type = "text/javascript";
    tag.src = url;

    // in case the browser is the internet explorer
    if (BrowserDetect.browser == "Explorer") {
        if (handler && handler != undefined)
            jsImportsPending.push([url, handler, handlerArguments, context]);

        if (!jsLoopingFlag) {
            jsLoopingFlag = true;
            setTimeout("testJsImport()", TEST_JS_IMPORT_TIMEOUT);
        }
    } else
        tag.onload = function() {
            if (handler && handler != undefined)
                handler.call(context, handlerArguments);
        }

    // retrieves the document head element
    var documentHead = document.getElementsByTagName("head")[0];

    // appends the tag to the document head element
    documentHead.appendChild(tag);
}

importScriptAjax = function(url, handler, handlerArguments, context) {
    new Ajax.Request(url, {
                method : "GET",
                evalJS : false,
                onSuccess : function(transport) {
                    eval(transport.responseText);

                    if (handler && handler != undefined)
                        handler.call(context, handlerArguments);
                }
            });
}

testCssImport = function() {
    // creates the style sheet remove list
    var styleSheetsRemoveList = [];

    // iterates over all the css files pending for load
    cssImportsPending.each(function(element, index) {
                var cssImport = cssImportsPending[index];
                var name = cssImport[0];
                var tag = cssImport[1];
                var handler = cssImport[2];
                var handlerArguments = cssImport[3];
                var context = cssImport[4];
                var styleSheetsList = document.styleSheets;
                var styleSheetsListLength = styleSheetsList.length;

                try {
                    tag.sheet.cssRule;
                    handler.call(context, handlerArguments);
                    styleSheetsRemoveList.push(cssImport);
                } catch (exception) {
                }
            }, this);

    // iterates over the list of stylesheets to remove
    styleSheetsRemoveList.each(function(element, index) {
        var styleSheetRemove = styleSheetsRemoveList[index];
        var styleSheetRemoveIndex = cssImportsPending.indexOf(styleSheetRemove);

        // in case it's not an invalid index (-1 for element not found)
        if (styleSheetRemoveIndex != -1)
            cssImportsPending.splice(styleSheetRemoveIndex, 1);
    }, this);

    if (cssImportsPending.length > 0)
        setTimeout("testCssImport()", TEST_CSS_IMPORT_TIMEOUT);
    else
        cssLoopingFlag = false;
}

testJsImport = function() {
    // creates the javascript remove list
    var javascriptRemoveList = [];

    // iterates over all the js files pending for load
    jsImportsPending.each(function(element, index) {
                var jsImport = jsImportsPending[index];
                var url = jsImport[0];
                var handler = jsImport[1];
                var handlerArguments = jsImport[2];
                var context = jsImport[3];

                var indexImportsLoaded = jsImportsLoaded.indexOf(url);

                if (indexImportsLoaded != -1) {
                    // calls the defined handler
                    handler.call(context, handlerArguments);

                    // removes the import from the remove list
                    javascriptRemoveList.push(jsImport);

                    // removes the imported js from the js imports loaded list
                    jsImportsLoaded.splice(indexImportsLoaded, 1);
                }
            }, this);

    // iterates over the list of js files to remove
    javascriptRemoveList.each(function(element, index) {
                var javascriptRemove = javascriptRemoveList[index];
                var javascriptRemoveIndex = jsImportsPending.indexOf(javascriptRemove);

                // in case it's not an invalid index (-1 for element not found)
                if (javascriptRemoveIndex != -1)
                    jsImportsPending.splice(javascriptRemoveIndex, 1);
            }, this);

    if (jsImportsPending.length > 0)
        setTimeout("testJsImport()", TEST_JS_IMPORT_TIMEOUT);
    else
        jsLoopingFlag = false;
}

loaded = function(url) {
    // iterates over all the js imnport pending to see if there's a need to add
    // the loaded js file to the js imports loaded list
    jsImportsPending.each(function(element, index) {
                var jsImportPending = jsImportsPending[index];
                var jsImportPendingUrl = jsImportPending[0];
                if (jsImportPendingUrl == url) {
                    jsImportsLoaded.push(url);
                    throw $break;
                }
            });
}
