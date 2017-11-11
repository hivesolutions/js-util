const encoding = require("./encoding");
const functional = require("./functional");
const general = require("./general");
const hash = require("./hash");
const logging = require("./logging");
const prism = require("./prism");
const string = require("./string");
const ui = require("./ui");

Object.assign(module.exports, encoding);
Object.assign(module.exports, functional);
Object.assign(module.exports, general);
Object.assign(module.exports, hash);
Object.assign(module.exports, logging);
Object.assign(module.exports, prism);
Object.assign(module.exports, string);
Object.assign(module.exports, ui);
