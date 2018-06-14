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
var Number = (_global.Number = _global.Number || {});

Number.SYMBOLS = {
    EUR: ["€", 1],
    USD: ["$", -1],
    GBP: ["£", -1],
    BRL: ["R$", -1],
    CAD: ["$", -1],
    AUD: ["$", -1],
    JPY: ["¥", -1],
    RUB: ["₽", 1],
    KRW: ["₩", -1],
    CHF: ["fr.", 1],
    SGD: ["$", -1],
    MXN: ["$", -1],
    DKK: ["kr.", 1],
    SEK: ["kr.", 1],
    PLN: ["zł", 1],
    TWD: ["NT$", -1]
};

Number.DECIMAL_PLACES = {
    EUR: 2,
    USD: 2,
    GBP: 2,
    BRL: 2,
    CAD: 2,
    AUD: 2,
    JPY: 0,
    RUB: 2,
    KRW: 0,
    CHF: 2,
    SGD: 2,
    MXN: 2,
    DKK: 2,
    SEK: 2,
    PLN: 2,
    TWD: 2
};

Number.SEPARATOR = {
    EUR: ",",
    USD: ".",
    GBP: ".",
    BRL: ",",
    CAD: ".",
    AUD: ".",
    JPY: ".",
    RUB: ",",
    KRW: ".",
    CHF: ".",
    SGD: ".",
    MXN: ".",
    DKK: ".",
    SEK: ",",
    PLN: "."
};

Number.THOUSANDS = {
    EUR: " ",
    USD: ",",
    GBP: ",",
    BRL: ".",
    CAD: ",",
    AUD: ",",
    JPY: ",",
    RUB: " ",
    KRW: ",",
    CHF: ",",
    SGD: ",",
    MXN: ",",
    DKK: ",",
    SEK: ".",
    PLN: " ",
    TWD: ","
};

Number.prototype.formatMoney = function(
    places,
    separator,
    thousands,
    currency,
    useSymbol
) {
    var number = this;
    var defaultPlaces = Number.DECIMAL_PLACES[currency];
    var defaultSeparator = Number.SEPARATOR[currency];
    var defaultThousands = Number.THOUSANDS[currency];
    defaultPlaces = defaultPlaces === undefined ? 2 : defaultPlaces;
    defaultSeparator = defaultSeparator === undefined ? "." : defaultSeparator;
    defaultThousands = defaultThousands === undefined ? "," : defaultThousands;
    places = isNaN(parseInt(places)) ? defaultPlaces : places;
    separator =
        separator === null || separator === undefined
            ? defaultSeparator
            : separator;
    thousands =
        thousands === null || thousands === undefined
            ? defaultThousands
            : thousands;
    var signal = number < 0 ? "-" : "";
    var integer = parseInt(Math.abs(+number || 0).toFixed(places)) + "";
    var remaining = integer.length;
    remaining = remaining > 3 ? remaining % 3 : 0;
    var money = signal;
    money += remaining ? integer.substr(0, remaining) + thousands : "";
    money += integer
        .substr(remaining)
        .replace(/(\d{3})(?=\d)/g, "$1" + thousands);
    money += places
        ? separator +
          Math.abs(Math.abs(number) - integer)
              .toFixed(places)
              .slice(2)
        : "";
    money = currency
        ? Number._formatCurrency(money, currency, useSymbol)
        : money;
    return money;
};

Number._formatCurrency = function(money, currency, useSymbol) {
    var symbol = useSymbol ? Number.SYMBOLS[currency] : null;
    symbol = symbol || [currency, 1];
    var position = symbol[1];
    symbol = symbol[0];
    money = position === 1 ? money + " " + symbol : symbol + " " + money;
    return money;
};

if (typeof module !== "undefined") {
    module.exports = {
        Number: Number
    };
}
