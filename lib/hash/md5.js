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
// __credits__   = Joseph Myers <e_mayilme@hotmail.com>

Md5 = Md5 || {};

/**
 * The list of hexadecimal characters available and indexed by position in the
 * radix.
 *
 * @type List
 */
Md5.HEXADECIMAL_CHARACTERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "a", "b", "c", "d", "e", "f"
];

/**
 * Retrieves the hexadecimal md5 digest for the given string value.
 *
 * @param {String}
 *            stringValue The string value to be used to calculate the md5
 *            hexadecimal digest
 * @return {String} A string containing the md5 hexadecimal digest value from
 *         the given string value.
 */
Md5.digest = function(stringValue) {
    // retrieves the digest value
    // for the string value and then
    // encodes it into hexadecimal
    var digest = Md5._md5(stringValue);
    var digestHex = Md5.hex(digest);

    // returns the digest in hexadecimal
    return digestHex;
}

/**
 * Converts the given string list (list 32 bit values) and converts it into an
 * hexadecimal string.
 *
 * @param {List}
 *            stringList The list of 32 bit number to be converted to
 *            hexadecimal string.
 * @return {String} The resulting hexadecimal string value from the string list
 *         conversion.
 */
Md5.hex = function(stringList) {
    // allocates the hexadecimal list
    var hexStringList = [];

    // iterates over the string list range
    // to convert the bytes into hexadecimal
    for (var index = 0; index < stringList.length; index++) {
        // converts the current character into hexadecimal
        hexStringList[index] = Md5.rhex(stringList[index]);
    }

    // returns the joininig of the hex
    // string list (creating the string value)
    return hexStringList.join("");
}

/**
 * Converts a number into an hexadecimal string value. The conversion method is
 * static and efficient.
 *
 * @param {Integer}
 *            number The integer "number" to be converted into an hexadecimal
 *            string.
 * @return {String} The hexadecimal string value representing the number
 */
Md5.rhex = function(number) {
    // starts the string value string
    var stringValue = "";

    // iterates over the four bytes in the 32 bit
    // number, to convert them into hexadecimal
    for (var index = 0; index < 4; index++) {
        stringValue += Md5.HEXADECIMAL_CHARACTERS[(number >> (index * 8 + 4)) & 0x0f] + Md5.HEXADECIMAL_CHARACTERS[
            (number >> (index * 8)) & 0x0f];
    }

    // returns the string value
    return stringValue;
}

/**
 * Adds two values and returns a 32 bit number representing the sum.
 *
 * @param {Integer}
 *            a The first value for the adding.
 * @param {Integer}
 *            b The second value for the adding.
 * @return {Integer} The result of the adding, in 32 bit format.
 */
Md5.add32 = function(a, b) {
    return (a + b) & 0xffffffff;
}

/**
 * Converts the given string value into a list of (32 bit) integer values. This
 * is required in order to deal correctly with the javascript strings.
 *
 * @param {String}
 *            stringValue The string to be converted into a 32 bit integer list
 * @return {List} The list of 32 bit integer values converted from the given
 *         string value.
 */
Md5.md5Block = function(stringValue) {
    // allocates the md5 blocks list
    var md5Blocks = [];

    // iterates over a cycle value
    for (var index = 0; index < 64; index += 4) {
        // calculates the current block value
        md5Blocks[index >> 2] = stringValue.charCodeAt(index) + (stringValue.charCodeAt(index + 1) << 8) + (
            stringValue.charCodeAt(index + 2) << 16) + (stringValue.charCodeAt(index + 3) << 24);
    }

    // returns the md5 blocks
    return md5Blocks;
}

Md5._md5Cycle = function(x, k) {
    var a = x[0];
    var b = x[1];
    var c = x[2];
    var d = x[3];

    a = Md5._ff(a, b, c, d, k[0], 7, -680876936);
    d = Md5._ff(d, a, b, c, k[1], 12, -389564586);
    c = Md5._ff(c, d, a, b, k[2], 17, 606105819);
    b = Md5._ff(b, c, d, a, k[3], 22, -1044525330);
    a = Md5._ff(a, b, c, d, k[4], 7, -176418897);
    d = Md5._ff(d, a, b, c, k[5], 12, 1200080426);
    c = Md5._ff(c, d, a, b, k[6], 17, -1473231341);
    b = Md5._ff(b, c, d, a, k[7], 22, -45705983);
    a = Md5._ff(a, b, c, d, k[8], 7, 1770035416);
    d = Md5._ff(d, a, b, c, k[9], 12, -1958414417);
    c = Md5._ff(c, d, a, b, k[10], 17, -42063);
    b = Md5._ff(b, c, d, a, k[11], 22, -1990404162);
    a = Md5._ff(a, b, c, d, k[12], 7, 1804603682);
    d = Md5._ff(d, a, b, c, k[13], 12, -40341101);
    c = Md5._ff(c, d, a, b, k[14], 17, -1502002290);
    b = Md5._ff(b, c, d, a, k[15], 22, 1236535329);

    a = Md5._gg(a, b, c, d, k[1], 5, -165796510);
    d = Md5._gg(d, a, b, c, k[6], 9, -1069501632);
    c = Md5._gg(c, d, a, b, k[11], 14, 643717713);
    b = Md5._gg(b, c, d, a, k[0], 20, -373897302);
    a = Md5._gg(a, b, c, d, k[5], 5, -701558691);
    d = Md5._gg(d, a, b, c, k[10], 9, 38016083);
    c = Md5._gg(c, d, a, b, k[15], 14, -660478335);
    b = Md5._gg(b, c, d, a, k[4], 20, -405537848);
    a = Md5._gg(a, b, c, d, k[9], 5, 568446438);
    d = Md5._gg(d, a, b, c, k[14], 9, -1019803690);
    c = Md5._gg(c, d, a, b, k[3], 14, -187363961);
    b = Md5._gg(b, c, d, a, k[8], 20, 1163531501);
    a = Md5._gg(a, b, c, d, k[13], 5, -1444681467);
    d = Md5._gg(d, a, b, c, k[2], 9, -51403784);
    c = Md5._gg(c, d, a, b, k[7], 14, 1735328473);
    b = Md5._gg(b, c, d, a, k[12], 20, -1926607734);

    a = Md5._hh(a, b, c, d, k[5], 4, -378558);
    d = Md5._hh(d, a, b, c, k[8], 11, -2022574463);
    c = Md5._hh(c, d, a, b, k[11], 16, 1839030562);
    b = Md5._hh(b, c, d, a, k[14], 23, -35309556);
    a = Md5._hh(a, b, c, d, k[1], 4, -1530992060);
    d = Md5._hh(d, a, b, c, k[4], 11, 1272893353);
    c = Md5._hh(c, d, a, b, k[7], 16, -155497632);
    b = Md5._hh(b, c, d, a, k[10], 23, -1094730640);
    a = Md5._hh(a, b, c, d, k[13], 4, 681279174);
    d = Md5._hh(d, a, b, c, k[0], 11, -358537222);
    c = Md5._hh(c, d, a, b, k[3], 16, -722521979);
    b = Md5._hh(b, c, d, a, k[6], 23, 76029189);
    a = Md5._hh(a, b, c, d, k[9], 4, -640364487);
    d = Md5._hh(d, a, b, c, k[12], 11, -421815835);
    c = Md5._hh(c, d, a, b, k[15], 16, 530742520);
    b = Md5._hh(b, c, d, a, k[2], 23, -995338651);

    a = Md5._ii(a, b, c, d, k[0], 6, -198630844);
    d = Md5._ii(d, a, b, c, k[7], 10, 1126891415);
    c = Md5._ii(c, d, a, b, k[14], 15, -1416354905);
    b = Md5._ii(b, c, d, a, k[5], 21, -57434055);
    a = Md5._ii(a, b, c, d, k[12], 6, 1700485571);
    d = Md5._ii(d, a, b, c, k[3], 10, -1894986606);
    c = Md5._ii(c, d, a, b, k[10], 15, -1051523);
    b = Md5._ii(b, c, d, a, k[1], 21, -2054922799);
    a = Md5._ii(a, b, c, d, k[8], 6, 1873313359);
    d = Md5._ii(d, a, b, c, k[15], 10, -30611744);
    c = Md5._ii(c, d, a, b, k[6], 15, -1560198380);
    b = Md5._ii(b, c, d, a, k[13], 21, 1309151649);
    a = Md5._ii(a, b, c, d, k[4], 6, -145523070);
    d = Md5._ii(d, a, b, c, k[11], 10, -1120210379);
    c = Md5._ii(c, d, a, b, k[2], 15, 718787259);
    b = Md5._ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = Md5.add32(a, x[0]);
    x[1] = Md5.add32(b, x[1]);
    x[2] = Md5.add32(c, x[2]);
    x[3] = Md5.add32(d, x[3]);
}

Md5._cmn = function(q, a, b, x, s, t) {
    a = Md5.add32(Md5.add32(a, q), Md5.add32(x, t));
    return Md5.add32((a << s) | (a >>> (32 - s)), b);
}

Md5._ff = function(a, b, c, d, x, s, t) {
    return Md5._cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

Md5._gg = function(a, b, c, d, x, s, t) {
    return Md5._cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

Md5._hh = function(a, b, c, d, x, s, t) {
    return Md5._cmn(b ^ c ^ d, a, b, x, s, t);
}

Md5._ii = function(a, b, c, d, x, s, t) {
    return Md5._cmn(c ^ (b | (~d)), a, b, x, s, t);
}

Md5._md5 = function(stringValue) {
    // retrieves the string value lenght as
    // the "number"
    var number = stringValue.length;

    // creates the initial md5 state and the initial
    // tail list value
    var state = [1732584193, -271733879, -1732584194, 271733878];
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // iterates over the "past-initial" string values to run
    // the intermediate md5 cycles
    for (var index = 64; index <= stringValue.length; index += 64) {
        // runs the intermediate md5 cycle
        Md5._md5Cycle(state, Md5.md5Block(stringValue.substring(index - 64,
            index)));
    }

    // retrieves the initial string value
    stringValue = stringValue.substring(index - 64);

    // runs over the string value length to "calculate" the
    // various tail values
    for (var index = 0; index < stringValue.length; index++) {
        // calculates the current tail value
        tail[index >> 2] |= stringValue.charCodeAt(index) << ((index % 4) << 3);
    }

    // calculates the tail value
    tail[index >> 2] |= 0x80 << ((index % 4) << 3);

    // in case the index is greater that
    // the minimum for the final tail calculation
    if (index > 55) {
        // runs an md5 cycle
        Md5._md5Cycle(state, tail);

        // iterates over all the tail values
        // to reset the tail list
        for (var index = 0; index < 16; index++) {
            // resets the tail element
            tail[index] = 0;
        }
    }

    // sets the final tail value
    // for the last cycle calculation
    tail[14] = number * 8;

    // runs the last md5 cycle
    Md5._md5Cycle(state, tail);

    // returns the state
    return state;
}
