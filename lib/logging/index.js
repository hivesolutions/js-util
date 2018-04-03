const handlers = require("./handlers");
const logging = require("./logging");

Object.assign(module.exports, handlers);
Object.assign(module.exports, logging);
