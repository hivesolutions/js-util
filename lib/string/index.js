const stringBuffer = require("./string_buffer");
const stringSize = require("./string_size");
const string = require("./string");
const template = require("./template");

Object.assign(module.exports, stringBuffer);
Object.assign(module.exports, stringSize);
Object.assign(module.exports, string);
Object.assign(module.exports, template);
