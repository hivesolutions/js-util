const assert = require("assert");
const util = require("../../");

describe("Logging", function() {
    describe("#getLogger()", function() {
        it("should be able to retrieve a proper Logger instance", () => {
            assert.notStrictEqual(util.Logging.getLogger("default"), null);
            assert.notStrictEqual(util.Logging.getLogger("default"), undefined);
        });
    });

    describe("#debug()", function() {
        it("should be able to log a debug", () => {
            assert.strictEqual(util.Logging.debug("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").debug("hello world"), undefined);
        });
    });

    describe("#info()", function() {
        it("should be able to log a info", () => {
            assert.strictEqual(util.Logging.info("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").info("hello world"), undefined);
        });
    });

    describe("#warn()", function() {
        it("should be able to log a warn", () => {
            assert.strictEqual(util.Logging.warn("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").warn("hello world"), undefined);
        });
    });

    describe("#warning()", function() {
        it("should be able to log a warning", () => {
            assert.strictEqual(util.Logging.warning("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").warning("hello world"), undefined);
        });
    });

    describe("#error()", function() {
        it("should be able to log an error", () => {
            assert.strictEqual(util.Logging.error("hello world"), undefined);
            assert.strictEqual(util.Logging.getLogger("default").error("hello world"), undefined);
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
    });
});
