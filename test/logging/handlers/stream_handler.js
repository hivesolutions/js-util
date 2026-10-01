const assert = require("assert");
const util = require("../../../");

const createStream = function(names) {
    const calls = [];
    const stream = { calls: calls };
    for (const name of names) {
        stream[name] = function() {
            calls.push([name].concat(Array.prototype.slice.call(arguments)));
        };
    }
    return stream;
};

const withEnvironment = function(values, isTTY, callable, isErrorTTY) {
    const previous = {};
    for (const key of Object.keys(values)) {
        previous[key] = process.env[key];
        if (values[key] === undefined) delete process.env[key];
        else process.env[key] = values[key];
    }
    const stdout = process.stdout;
    const stderr = process.stderr;
    const previousTTY = stdout ? stdout.isTTY : undefined;
    const previousErrorTTY = stderr ? stderr.isTTY : undefined;
    if (stdout) stdout.isTTY = isTTY;
    if (stderr) stderr.isTTY = isErrorTTY === undefined ? isTTY : isErrorTTY;
    const result = callable();
    if (stdout) stdout.isTTY = previousTTY;
    if (stderr) stderr.isTTY = previousErrorTTY;
    for (const key of Object.keys(previous)) {
        if (previous[key] === undefined) delete process.env[key];
        else process.env[key] = previous[key];
    }
    return result;
};

describe("StreamHandler", function() {
    describe("#StreamHandler()", function() {
        it("should be able to create a StreamHandler with the default values", () => {
            const handler = new util.Logging.StreamHandler();
            assert.strictEqual(handler.stream, console);
            assert.strictEqual(handler.colors, util.Logging.StreamHandler.getColors());
        });
        it("should be able to create a StreamHandler with explicit values", () => {
            const stream = createStream(["info"]);
            assert.strictEqual(new util.Logging.StreamHandler(stream, "css").colors, "css");
            assert.strictEqual(new util.Logging.StreamHandler(stream, null).colors, null);
            assert.strictEqual(new util.Logging.StreamHandler(stream).stream, stream);
        });
    });

    describe("#getColors()", function() {
        it("should detect the colors of terminals", () => {
            const values = { NO_COLOR: undefined, FORCE_COLOR: undefined };
            assert.strictEqual(
                withEnvironment(values, true, () => util.Logging.StreamHandler.getColors()),
                "ansi"
            );
            assert.strictEqual(
                withEnvironment(values, false, () => util.Logging.StreamHandler.getColors()),
                null
            );
        });
        it("should not detect the colors of terminals with the errors redirected", () => {
            const values = { NO_COLOR: undefined, FORCE_COLOR: undefined };
            assert.strictEqual(
                withEnvironment(values, true, () => util.Logging.StreamHandler.getColors(), false),
                null
            );
        });
        it("should respect the colors of the environment", () => {
            assert.strictEqual(
                withEnvironment({ NO_COLOR: "1", FORCE_COLOR: "1" }, true, () =>
                    util.Logging.StreamHandler.getColors()
                ),
                null
            );
            assert.strictEqual(
                withEnvironment({ NO_COLOR: "", FORCE_COLOR: "1" }, false, () =>
                    util.Logging.StreamHandler.getColors()
                ),
                "ansi"
            );
            assert.strictEqual(
                withEnvironment({ NO_COLOR: undefined, FORCE_COLOR: "" }, false, () =>
                    util.Logging.StreamHandler.getColors()
                ),
                "ansi"
            );
            for (const value of ["0", "false"]) {
                assert.strictEqual(
                    withEnvironment({ NO_COLOR: undefined, FORCE_COLOR: value }, true, () =>
                        util.Logging.StreamHandler.getColors()
                    ),
                    null
                );
            }
        });
        it("should detect the colors of the browser", () => {
            const descriptor = Object.getOwnPropertyDescriptor(process, "stdout");
            Object.defineProperty(process, "stdout", {
                value: undefined,
                configurable: true,
                writable: true
            });
            const values = { NO_COLOR: undefined, FORCE_COLOR: undefined };
            const withoutWindow = withEnvironment(values, undefined, () =>
                util.Logging.StreamHandler.getColors()
            );
            global.window = {};
            const withWindow = withEnvironment(values, undefined, () =>
                util.Logging.StreamHandler.getColors()
            );
            delete global.window;
            Object.defineProperty(process, "stdout", descriptor);
            assert.strictEqual(withoutWindow, null);
            assert.strictEqual(withWindow, "css");
        });
    });

    describe("#emit()", function() {
        it("should print with the method of the level of the record", () => {
            const stream = createStream(["debug", "info", "warn", "error"]);
            const handler = new util.Logging.StreamHandler(stream, null);
            for (const level of ["NOTSET", "DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]) {
                handler.emit(new util.Logging.Record(level, util.Logging.constants[level]));
            }
            assert.deepStrictEqual(stream.calls, [
                ["debug", "NOTSET"],
                ["debug", "DEBUG"],
                ["info", "INFO"],
                ["warn", "WARNING"],
                ["error", "ERROR"],
                ["error", "CRITICAL"]
            ]);
        });
        it("should print with the info method when the stream does not provide one", () => {
            const stream = createStream(["info"]);
            const handler = new util.Logging.StreamHandler(stream, null);
            handler.emit(new util.Logging.Record("hello world", util.Logging.constants.ERROR));
            handler.emit(new util.Logging.Record("hello world", 25));
            assert.deepStrictEqual(stream.calls, [
                ["info", "hello world"],
                ["info", "hello world"]
            ]);
        });
        it("should print the formatted arguments of the record", () => {
            const colors = util.Logging.SimpleFormatter.COLORS.css;
            const stream = createStream(["info"]);
            const handler = new util.Logging.StreamHandler(stream, "css");
            handler.setFormatter(new util.Logging.SimpleFormatter("{level} {message}"));
            const record = new util.Logging.Record("hello world", 20, "uscan", [{ key: 1 }]);
            handler.emit(record);
            assert.deepStrictEqual(stream.calls, [
                ["info", "%c INFO %c", colors.level.INFO, "", "hello world", { key: 1 }]
            ]);
        });
    });
});
