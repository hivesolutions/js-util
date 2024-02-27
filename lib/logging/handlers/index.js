const consolaHandler = require("./consola_handler");
const loggyHandler = require("./loggy_handler");
const logstashHandler = require("./logstash_handler");
const streamHandler = require("./stream_handler");

Object.assign(module.exports, consolaHandler);
Object.assign(module.exports, loggyHandler);
Object.assign(module.exports, logstashHandler);
Object.assign(module.exports, streamHandler);
