const logging = require("./logging");
const loggyHandler = require("./loggy_handler");
const streamHandler = require("./stream_handler");

Object.assign(module.exports, logging);
Object.assign(module.exports, loggyHandler);
Object.assign(module.exports, streamHandler);
