// Hive Colony Framework
// Copyright (C) 2008-2014 Hive Solutions Lda.
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
// __revision__  = $LastChangedRevision$
// __date__      = $LastChangedDate$
// __copyright__ = Copyright (c) 2008-2014 Hive Solutions Lda.
// __license__   = GNU General Public License (GPL), Version 3

/**
 * @fileoverview This file contains functions used to generate random data.
 *
 * @author Tiago Silva <tsilva@hive.pt>
 * @version 1.0.0
 */

"pt.hive.colony.web.mock.generator".namespace();

// string with upper case characters
pt.hive.colony.web.mock.upperCaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// string with lower case characters
pt.hive.colony.web.mock.lowerCaseCharacters = "abcdefghijklmnopqrstuvwxyz";

// lorem ipsum phrase to generate any lorem ipsum with
pt.hive.colony.web.mock.loremIpsum = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. "
        + "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. "
        + "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis "
        + "at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi."

// list of person first names
pt.hive.colony.web.mock.firstNames = ["Tobias", "Matias", "Dias", "Golias",
        "Jeremias"];

// list of person last names
pt.hive.colony.web.mock.lastNames = ["Silva", "Martinho", "Magalhães", "Lima",
        "Rio"];

// list of usernames
pt.hive.colony.web.mock.usernames = ["tsilva", "lmartinho", "srio", "nlima",
        "joamag"];

// list of cities
pt.hive.colony.web.mock.cities = ["Porto", "Lisboa", "Coimbra", "Aveiro",
        "Braga"];

// list of countries
pt.hive.colony.web.mock.countries = ["Portugal", "Espanha", "França", "Itália",
        "Alemanha"];

// list of internet domains
pt.hive.colony.web.mock.internetDomains = ["domain1.com", "domain2.net",
        "domain3.org", "domain4.gov", "domain5.edu"];

/**
 * Selects a random item from a specified array.
 *
 * @param {List}
 *            options List of options to choose from.
 * @return {Object} Random option.
 */
pt.hive.colony.web.mock.generator.generateRandomOption = function(options) {
    var index = Math.floor(Math.random() * options.size());
    var result = options[index];

    return result;
}

/**
 * Generates a random combination of string tokens.
 *
 * @param {List}
 *            optionSets List of arrays with string tokens.
 * @param {Integer}
 *            numberTokens Number of string tokens the result should have.
 * @param {String}
 *            delimiter Delimiter to separate the tokens with.
 * @return {String} Random string permutation.
 */
pt.hive.colony.web.mock.generator.generateRandomStringPermutation = function(optionSets, numberTokens, delimiter) {
    var result = "";

    for (var x = 0; x < numberTokens; x++) {
        var optionSetIndex = x % optionSets.size();
        var optionSet = optionSets[optionSetIndex];
        var option = pt.hive.colony.web.mock.generator.generateRandomOption(optionSet);
        result += option + ((x < numberTokens - 1) ? delimiter : "");
    }

    return result;
}

/**
 * Generates a lorem ipsum.
 *
 * @param {Integer}
 *            numberWords Number of words the lorem ipsum should have.
 * @return {String} Random lorem ipsum.
 */
pt.hive.colony.web.mock.generator.generateRandomLoremIpsum = function(numberWords) {
    var loremIpsumTokens = pt.hive.colony.web.mock.loremIpsum.split(" ");
    numberWords = numberWords < loremIpsumTokens.size()
            ? numberWords
            : loremIpsumTokens.size();

    var result = "";
    for (var x = 0; x < numberWords; x++) {
        result += loremIpsumTokens[x] + ((x < numberWords - 1) ? " " : "");
    }

    return result;
}

/**
 * Generates a random street name.
 *
 * @return {String} Random street name.
 */
pt.hive.colony.web.mock.generator.generateRandomStreet = function() {
    var type = pt.hive.colony.web.mock.generator.generateRandomOption([
            "Rua de", "Avenida de", "Travessa de", "Praça de"]);
    var name = pt.hive.colony.web.mock.generator.generateRandomName(3);
    var result = type + " " + name;

    return result;
}

/**
 * Generates a random zip code.
 *
 * @return {String} Random zip code.
 */
pt.hive.colony.web.mock.generator.generateRandomZipCode = function() {
    var fistPart = pt.hive.colony.web.mock.generator.generateRandomNumber(1000,
            9999);
    var secondPart = pt.hive.colony.web.mock.generator.generateRandomNumber(
            100, 999);
    var result = fistPart + "-" + secondPart;

    return result;
}

/**
 * Generates a random identification code.
 *
 * @param {Integer}
 *            numberDigits Number of digits the identification code should have.
 * @return {String} Random identification code.
 */
pt.hive.colony.web.mock.generator.generateRandomIdentificationCode = function(numberDigits) {
    var result = "";

    for (var x = 0; x < numberDigits; x++) {
        var character = pt.hive.colony.web.mock.generator.generateRandomBoolean();
        if (character) {
            var randomCharacter = pt.hive.colony.web.mock.generator.generateRandomCharacter("upper");
            result += randomCharacter;
        } else {
            var randomNumber = pt.hive.colony.web.mock.generator.generateRandomNumber(
                    0, 9);
            result += randomNumber;
        }
    }

    return result;
}

/**
 * Generates a random person name.
 *
 * @param {Integer}
 *            numberNames Number of names the person should have.
 * @return {String} Random name.
 */
pt.hive.colony.web.mock.generator.generateRandomName = function(numberNames) {
    var result = pt.hive.colony.web.mock.generator.generateRandomStringPermutation(
            [pt.hive.colony.web.mock.firstNames,
                    pt.hive.colony.web.mock.lastNames], numberNames, " ");

    return result;
}

/**
 * Generates a random phone number.
 *
 * @return {String} Random phone number.
 */
pt.hive.colony.web.mock.generator.generateRandomPhone = function() {
    var result = "+351 22";

    for (var x = 0; x < 7; x++) {
        result += pt.hive.colony.web.mock.generator.generateRandomNumber(0, 9);
    }

    return result;
}

/**
 * Generates a random date.
 *
 * @return {String} Random date.
 */
pt.hive.colony.web.mock.generator.generateRandomDate = function() {
    var result = "";

    result += pt.hive.colony.web.mock.generator.generateRandomNumber(1, 28);
    result += "/";
    result += pt.hive.colony.web.mock.generator.generateRandomNumber(1, 12);
    result += "/";
    result += pt.hive.colony.web.mock.generator.generateRandomNumber(1984, 2009);

    return result;
}

/**
 * Generates a random email address.
 *
 * @return {String} Random email address.
 */
pt.hive.colony.web.mock.generator.generateRandomEmail = function() {
    var result = pt.hive.colony.web.mock.generator.generateRandomStringPermutation(
            [pt.hive.colony.web.mock.usernames,
                    pt.hive.colony.web.mock.internetDomains], 2, "@");

    return result;
}

/**
 * Generates a random universal resource locator.
 *
 * @return {String} Random url.
 */
pt.hive.colony.web.mock.generator.generateRandomUrl = function() {
    var result = "http://www."
            + pt.hive.colony.web.mock.generator.generateRandomOption(pt.hive.colony.web.mock.internetDomains)
            + "/"
            + pt.hive.colony.web.mock.generator.generateRandomIdentificationCode(10)
            + "/main.html";

    return result;
}

/**
 * Generates a random number.
 *
 * @param {Integer}
 *            minimum Lower boundary for the random number.
 * @param {Integer}
 *            maximum Upper boundary for the random number.
 * @return {Integer} Random number.
 */
pt.hive.colony.web.mock.generator.generateRandomNumber = function(minimum, maximum) {
    var result = Math.floor(Math.random() * (maximum + 1)) + minimum;

    return result;
}

/**
 * Generates a random character.
 *
 * @param {String}
 *            type Case type: upper, lower (if null both cases will be used).
 * @return {String} Random character.
 */
pt.hive.colony.web.mock.generator.generateRandomCharacter = function(type) {
    var characterSet = type == "upper"
            ? pt.hive.colony.web.mock.upperCaseCharacters
            : pt.hive.colony.web.mock.lowerCaseCharacters;
    if (type == null) {
        characterSet = pt.hive.colony.web.mock.upperCaseCharacters
                + pt.hive.colony.web.mock.lowerCaseCharacters;
    }

    var characterIndex = Math.floor(Math.random() * characterSet.length);
    var result = characterSet[characterIndex];

    return result;
}

/**
 * Generates a random boolean.
 *
 * @return {Boolean} Random boolean.
 */
pt.hive.colony.web.mock.generator.generateRandomBoolean = function() {
    var number = pt.hive.colony.web.mock.generator.generateRandomNumber(0, 1);
    var result = number == 0 ? false : true;

    return result;
}
