const assert = require("assert");
const fs = require("fs");
const vm = require("vm");
const util = require("../../");

const capture = function(logger, callable) {
    const records = [];
    const handler = new util.Logging.Handler();
    handler.emit = record => records.push(record);
    logger.addHandler(handler);
    callable();
    logger.handlers.splice(logger.handlers.indexOf(handler), 1);
    return records;
};

describe("Logging", function() {
    describe("#getLogger()", function() {
        it("should keep the loggers of a previous loading", () => {
            const source = fs.readFileSync(require.resolve("../../lib/logging/logging"), "utf8");
            const logger = {};
            const context = { global: { Logging: { loggers: { kept: logger } } } };
            vm.runInNewContext(source, context);
            assert.strictEqual(context.global.Logging.loggers.kept, logger);
            assert.notStrictEqual(context.global.Logging.getLogger, undefined);
        });
        it("should be able to retrieve a proper Logger instance", () => {
            assert.notStrictEqual(util.Logging.getLogger("default"), null);
            assert.notStrictEqual(util.Logging.getLogger("default"), undefined);
        });
        it("should be able to retrieve a Logger with the propagation of the defaults", () => {
            const logger = util.Logging.getLogger("getLogger.propagate", { propagate: true });
            assert.strictEqual(logger.propagate, true);
            assert.deepStrictEqual(logger.handlers, []);
            assert.strictEqual(util.Logging.getLogger("getLogger.default").propagate, false);
        });
    });

    describe("#debug()", function() {
        it("should be able to log a debug", () => {
            assert.strictEqual(util.Logging.debug("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").debug("hello world"), undefined);
        });
        it("should be able to log a debug with extra arguments", () => {
            const logger = util.Logging.getLogger("default");
            const level = logger.level;
            logger.setLevel(util.Logging.constants.DEBUG);
            const records = capture(logger, () => util.Logging.debug("hello world", 1, "two"));
            logger.setLevel(level);
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getMessage(), "hello world");
            assert.strictEqual(records[0].getLevel(), util.Logging.constants.DEBUG);
            assert.strictEqual(records[0].getName(), "default");
            assert.deepStrictEqual(records[0].getArgs(), [1, "two"]);
        });
    });

    describe("#info()", function() {
        it("should be able to log a info", () => {
            assert.strictEqual(util.Logging.info("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").info("hello world"), undefined);
        });
        it("should be able to log a info with extra arguments", () => {
            const logger = util.Logging.getLogger("default");
            const records = capture(logger, () => util.Logging.info("hello world", { key: 1 }));
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getLevel(), util.Logging.constants.INFO);
            assert.deepStrictEqual(records[0].getArgs(), [{ key: 1 }]);
        });
    });

    describe("#warn()", function() {
        it("should be able to log a warn", () => {
            assert.strictEqual(util.Logging.warn("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").warn("hello world"), undefined);
        });
        it("should be able to log a warn with extra arguments", () => {
            const logger = util.Logging.getLogger("default");
            const records = capture(logger, () => util.Logging.warn("hello world", 1));
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getLevel(), util.Logging.constants.WARNING);
            assert.deepStrictEqual(records[0].getArgs(), [1]);
        });
    });

    describe("#warning()", function() {
        it("should be able to log a warning", () => {
            assert.strictEqual(util.Logging.warning("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").warning("hello world"), undefined);
        });
        it("should be able to log a warning with extra arguments", () => {
            const logger = util.Logging.getLogger("default");
            const records = capture(logger, () => util.Logging.warning("hello world", 1));
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getLevel(), util.Logging.constants.WARNING);
            assert.deepStrictEqual(records[0].getArgs(), [1]);
        });
    });

    describe("#error()", function() {
        it("should be able to log an error", () => {
            assert.strictEqual(util.Logging.error("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").error("hello world"), undefined);
        });
        it("should be able to log an error with extra arguments", () => {
            const logger = util.Logging.getLogger("default");
            const error = new Error("failure");
            const records = capture(logger, () => util.Logging.error("hello world", error));
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getLevel(), util.Logging.constants.ERROR);
            assert.strictEqual(records[0].getArgs()[0], error);
        });
    });

    describe("#critical()", function() {
        it("should be able to log a critical", () => {
            assert.strictEqual(util.Logging.critical("hello world"), undefined);
            assert.strictEqual(
                util.Logging.getLogger("default").critical("hello world"),
                undefined
            );
        });
        it("should be able to log a critical with extra arguments", () => {
            const logger = util.Logging.getLogger("default");
            const records = capture(logger, () => util.Logging.critical("hello world", 1, 2));
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getLevel(), util.Logging.constants.CRITICAL);
            assert.deepStrictEqual(records[0].getArgs(), [1, 2]);
        });
    });
});

describe("Logger", function() {
    describe("#Logger()", function() {
        it("should be able to create a Logger with the default values", () => {
            const logger = new util.Logging.Logger("Logger.defaults");
            assert.strictEqual(logger.loggerName, "Logger.defaults");
            assert.strictEqual(logger.level, util.Logging.constants.DEFAULT_LEVEL);
            assert.deepStrictEqual(logger.handlers, []);
            assert.strictEqual(logger.propagate, false);
        });
        it("should be able to create a Logger with explicit values", () => {
            const logger = new util.Logging.Logger(
                "Logger.explicit",
                util.Logging.constants.ERROR,
                [],
                true
            );
            assert.strictEqual(logger.level, util.Logging.constants.ERROR);
            assert.strictEqual(logger.propagate, true);
        });
    });

    describe("#info()", function() {
        it("should be able to log with the name of the Logger", () => {
            const logger = new util.Logging.Logger("Logger.info");
            const records = capture(logger, () => logger.info("hello world", 1));
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getName(), "Logger.info");
            assert.deepStrictEqual(records[0].getArgs(), [1]);
        });
        it("should not log below the level of the Logger", () => {
            const logger = new util.Logging.Logger("Logger.level", util.Logging.constants.WARNING);
            const records = capture(logger, () => logger.info("hello world", 1));
            assert.deepStrictEqual(records, []);
        });
    });

    describe("#callHandlers()", function() {
        it("should propagate the records to the default Logger", () => {
            const logger = new util.Logging.Logger("Logger.propagate", undefined, undefined, true);
            const root = util.Logging.getLogger("default");
            const records = capture(root, () => logger.info("hello world"));
            assert.strictEqual(records.length, 1);
            assert.strictEqual(records[0].getName(), "Logger.propagate");
        });
        it("should not propagate the records when not requested", () => {
            const logger = new util.Logging.Logger("Logger.local");
            const root = util.Logging.getLogger("default");
            const records = capture(root, () => logger.info("hello world"));
            assert.deepStrictEqual(records, []);
        });
        it("should not propagate the records of the default Logger to itself", () => {
            const root = util.Logging.getLogger("default");
            const propagate = root.propagate;
            root.propagate = true;
            const records = capture(root, () => root.info("hello world"));
            root.propagate = propagate;
            assert.strictEqual(records.length, 1);
        });
    });
});

describe("Record", function() {
    describe("#Record()", function() {
        it("should be able to create a Record with the default values", () => {
            const record = new util.Logging.Record("hello world", util.Logging.constants.INFO);
            assert.strictEqual(record.getMessage(), "hello world");
            assert.strictEqual(record.getLevel(), util.Logging.constants.INFO);
            assert.strictEqual(record.getName(), "default");
            assert.deepStrictEqual(record.getArgs(), []);
            assert.strictEqual(record.getCreated() instanceof Date, true);
        });
    });

    describe("#getName()", function() {
        it("should be able to retrieve the name of the Logger", () => {
            const record = new util.Logging.Record("hello world", 20, "uscan");
            assert.strictEqual(record.getName(), "uscan");
        });
    });

    describe("#getArgs()", function() {
        it("should be able to retrieve the extra arguments", () => {
            const record = new util.Logging.Record("hello world", 20, "uscan", [1, "two"]);
            assert.deepStrictEqual(record.getArgs(), [1, "two"]);
        });
    });

    describe("#getCreated()", function() {
        it("should be able to retrieve the date of creation", () => {
            const before = Date.now();
            const record = new util.Logging.Record("hello world", 20);
            const after = Date.now();
            assert.strictEqual(record.getCreated().getTime() >= before, true);
            assert.strictEqual(record.getCreated().getTime() <= after, true);
        });
    });
});

describe("Handler", function() {
    describe("#formatArgs()", function() {
        it("should be able to format the arguments without a formatter", () => {
            const handler = new util.Logging.Handler();
            const record = new util.Logging.Record("hello world", 20, "uscan", [1]);
            assert.deepStrictEqual(handler.formatArgs(record), ["%s", "hello world", 1]);
            const single = new util.Logging.Record("hello world", 20, "uscan");
            assert.deepStrictEqual(handler.formatArgs(single), ["hello world"]);
        });
        it("should not interpret the message as a format without a formatter", () => {
            const handler = new util.Logging.Handler();
            const record = new util.Logging.Record("100% %s %d", 20, "uscan", ["value"]);
            assert.deepStrictEqual(handler.formatArgs(record), ["%s", "100% %s %d", "value"]);
        });
        it("should keep the messages that are not strings inspectable without a formatter", () => {
            const handler = new util.Logging.Handler();
            const message = { key: "value" };
            const record = new util.Logging.Record(message, 20, "uscan", [1]);
            const args = handler.formatArgs(record);
            assert.deepStrictEqual(args, [message, 1]);
            assert.strictEqual(args[0], message);
        });
        it("should be able to format the arguments with a formatter of messages", () => {
            const handler = new util.Logging.Handler();
            handler.setFormatter({ format: record => "formatted " + record.getMessage() });
            const record = new util.Logging.Record("hello world", 20, "uscan", [1]);
            assert.deepStrictEqual(handler.formatArgs(record), ["%s", "formatted hello world", 1]);
        });
        it("should be able to format the arguments with the colors of the handler", () => {
            const handler = new util.Logging.Handler();
            handler.colors = "css";
            handler.setFormatter({ formatArgs: (record, colors) => [colors] });
            const record = new util.Logging.Record("hello world", 20);
            assert.deepStrictEqual(handler.formatArgs(record), ["css"]);
        });
    });
});

describe("Formatter", function() {
    describe("#formatArgs()", function() {
        it("should be able to format the message followed by the extra arguments", () => {
            const formatter = new util.Logging.Formatter();
            formatter.format = record => "formatted " + record.getMessage();
            const record = new util.Logging.Record("hello world", 20, "uscan", [1, 2]);
            assert.deepStrictEqual(formatter.formatArgs(record, "css"), [
                "%s",
                "formatted hello world",
                1,
                2
            ]);
            const single = new util.Logging.Record("hello world", 20, "uscan");
            assert.deepStrictEqual(formatter.formatArgs(single), ["formatted hello world"]);
        });
        it("should keep the messages that are not strings inspectable", () => {
            const formatter = new util.Logging.Formatter();
            formatter.format = record => record.getMessage();
            const message = { key: "value" };
            const record = new util.Logging.Record(message, 20, "uscan", [1, 2]);
            const args = formatter.formatArgs(record);
            assert.deepStrictEqual(args, [message, 1, 2]);
            assert.strictEqual(args[0], message);
        });
    });
});
