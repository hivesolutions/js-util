const encoding = require("./encoding");
const functional = require("./functional");
const general = require("./general");
const hash = require("./hash");

Object.assign(module.exports, encoding);
Object.assign(module.exports, functional);
Object.assign(module.exports, general);
Object.assign(module.exports, hash);
