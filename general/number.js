// Hive Colony Framework
// Copyright (c) 2008-2015 Hive Solutions Lda.
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

var Number = Number || {};

Number.SYMBOLS = {
    "EUR" : ["€", 1],
    "USD" : ["$", -1],
    "GBP" : ["£", -1],
    "RUB" : ["₽", 1]
};

Number.DECIMAL_PLACES = {
    "EUR" : 2,
    "USD" : 2,
    "GBP" : 2,
    "BRL" : 2,
    "CAD" : 2,
    "AUD" : 2,
    "JPY" : 0,
    "RUB" : 2,
    "KRW" : 0,
    "CHF" : 2,
    "SGD" : 2,
    "MXN" : 2
};

Number.prototype.formatMoney = function(places, separator, thousands, currency, useSymbol) {
    var number = this;
    var defaultPlaces = Number.DECIMAL_PLACES[currency] || 2;
    places = isNaN(places = Math.abs(places)) ? defaultPlaces : places;
    separator = separator == undefined ? "." : separator;
    thousands = thousands == undefined ? "," : thousands;
    var signal = number < 0 ? "-" : "";
    var integer = parseInt(n = Math.abs(+number || 0).toFixed(places)) + "";
    var remaining = (remaining = integer.length) > 3 ? remaining % 3 : 0;
    var money = signal;
    money += remaining ? integer.substr(0, remaining) + thousands : "";
    money += integer.substr(remaining).replace(/(\d{3})(?=\d)/g,
            "$1" + thousands);
    money += places ? separator
            + Math.abs(number - integer).toFixed(places).slice(2) : "";
    money = currency
            ? Number._formatCurrency(money, currency, useSymbol)
            : money;
    return money;
};

Number._formatCurrency = function(money, currency, useSymbol) {
    var symbol = useSymbol ? Number.SYMBOLS[currency] : null;
    symbol = symbol || [currency, 1];
    var position = symbol[1];
    var symbol = symbol[0];
    money = position == 1 ? money + " " + symbol : symbol + " " + money;
    return money;
};
