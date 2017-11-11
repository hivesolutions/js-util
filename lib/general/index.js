const array = require("./array");
const browser = require("./browser");
const classReference = require("./class_reference");
const cookie = require("./cookie");
const date = require("./date");
const number = require("./number");

Object.assign(module.exports, array);
Object.assign(module.exports, browser);
Object.assign(module.exports, classReference);
Object.assign(module.exports, cookie);
Object.assign(module.exports, date);
Object.assign(module.exports, number);
