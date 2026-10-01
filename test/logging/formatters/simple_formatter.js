const assert = require("assert");
const util = require("../../../");

const createRecord = function(level, name, args) {
    const record = new util.Logging.Record("hello world", level, name, args);
    record.created = new Date(2026, 0, 2, 3, 4, 5, 6);
    return record;
};

describe("SimpleFormatter", function() {
    describe("#selectColor()", function() {
        it("should select the same style for the same name", () => {
            const styles = util.Logging.SimpleFormatter.COLORS.css.name;
            const style = util.Logging.SimpleFormatter.selectColor("uscan", styles);
            assert.strictEqual(util.Logging.SimpleFormatter.selectColor("uscan", styles), style);
            assert.strictEqual(styles.indexOf(style) !== -1, true);
        });
        it("should select the style through the hash of the name", () => {
            const styles = util.Logging.SimpleFormatter.COLORS.ansi.name;
            assert.strictEqual(
                util.Logging.SimpleFormatter.selectColor("uscan", styles),
                "\u001b[1;94m"
            );
            assert.strictEqual(
                util.Logging.SimpleFormatter.selectColor("uxfilter", styles),
                "\u001b[1;92m"
            );
            assert.strictEqual(util.Logging.SimpleFormatter.selectColor("", styles), styles[0]);
        });
        it("should select the style for names that are not strings", () => {
            const styles = util.Logging.SimpleFormatter.COLORS.css.name;
            const style = util.Logging.SimpleFormatter.selectColor(42, styles);
            assert.strictEqual(util.Logging.SimpleFormatter.selectColor("42", styles), style);
        });
    });

    describe("#format()", function() {
        it("should format with the default format and the date of the record", () => {
            const formatter = new util.Logging.SimpleFormatter();
            const record = createRecord(util.Logging.constants.INFO, "uscan", [1]);
            assert.strictEqual(
                formatter.format(record),
                "2026-01-02 03:04:05,006 [INFO] hello world"
            );
        });
        it("should format with the name of the logger", () => {
            const formatter = new util.Logging.SimpleFormatter("[{level}] [{name}] {message}");
            const record = createRecord(util.Logging.constants.WARNING, "uscan");
            assert.strictEqual(formatter.format(record), "[WARNING] [uscan] hello world");
        });
    });

    describe("#formatArgs()", function() {
        it("should format without colors", () => {
            const formatter = new util.Logging.SimpleFormatter("{level} {name} {message}");
            const record = createRecord(util.Logging.constants.INFO, "uscan", [1, "two"]);
            assert.deepStrictEqual(formatter.formatArgs(record), [
                "%s",
                "INFO uscan hello world",
                1,
                "two"
            ]);
            assert.deepStrictEqual(formatter.formatArgs(record, null), [
                "%s",
                "INFO uscan hello world",
                1,
                "two"
            ]);
            assert.deepStrictEqual(formatter.formatArgs(record, "invalid"), [
                "%s",
                "INFO uscan hello world",
                1,
                "two"
            ]);
            const single = createRecord(util.Logging.constants.INFO, "uscan");
            assert.deepStrictEqual(formatter.formatArgs(single), ["INFO uscan hello world"]);
        });
        it("should not interpret the message as a format without colors", () => {
            const formatter = new util.Logging.SimpleFormatter("{name} {message}");
            const record = new util.Logging.Record("100% %s", 20, "uscan", ["value"]);
            assert.deepStrictEqual(formatter.formatArgs(record), ["%s", "uscan 100% %s", "value"]);
        });
        it("should format with CSS colors", () => {
            const colors = util.Logging.SimpleFormatter.COLORS.css;
            const formatter = new util.Logging.SimpleFormatter(
                "{asctime} {level} {name} {message}"
            );
            const record = createRecord(util.Logging.constants.INFO, "uscan", [1]);
            assert.deepStrictEqual(formatter.formatArgs(record, "css"), [
                "%c2026-01-02 03:04:05,006%c %c INFO %c %cuscan%c",
                colors.asctime,
                "",
                colors.level.INFO,
                "",
                util.Logging.SimpleFormatter.selectColor("uscan", colors.name),
                "",
                "hello world",
                1
            ]);
        });
        it("should format with ANSI colors", () => {
            const colors = util.Logging.SimpleFormatter.COLORS.ansi;
            const formatter = new util.Logging.SimpleFormatter(
                "{asctime} {level} {name} {message}"
            );
            const record = createRecord(util.Logging.constants.ERROR, "uscan", [1]);
            assert.deepStrictEqual(formatter.formatArgs(record, "ansi"), [
                "\u001b[90m2026-01-02 03:04:05,006\u001b[0m " +
                    "\u001b[1;31mERROR\u001b[0m \u001b[1;94muscan\u001b[0m",
                "hello world",
                1
            ]);
            assert.strictEqual(colors.reset, "\u001b[0m");
        });
        it("should format with the colors of each of the levels", () => {
            const colors = util.Logging.SimpleFormatter.COLORS.css;
            const formatter = new util.Logging.SimpleFormatter("{level} {message}");
            for (const level of ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]) {
                const record = createRecord(util.Logging.constants[level], "uscan");
                assert.deepStrictEqual(formatter.formatArgs(record, "css"), [
                    "%c " + level + " %c",
                    colors.level[level],
                    "",
                    "hello world"
                ]);
            }
        });
        it("should format the text after the message as an argument", () => {
            const formatter = new util.Logging.SimpleFormatter("{level} {message} ({name})");
            const record = createRecord(util.Logging.constants.INFO, "uscan", [1]);
            assert.deepStrictEqual(formatter.formatArgs(record, "ansi"), [
                "\u001b[1;36mINFO\u001b[0m",
                "hello world",
                "(uscan)",
                1
            ]);
        });
        it("should format without the message when not in the format", () => {
            const colors = util.Logging.SimpleFormatter.COLORS.css;
            const formatter = new util.Logging.SimpleFormatter("{level}");
            const record = createRecord(util.Logging.constants.INFO, "uscan", [1]);
            assert.deepStrictEqual(formatter.formatArgs(record, "css"), [
                "%c INFO %c",
                colors.level.INFO,
                "",
                1
            ]);
        });
        it("should format the message alone when there is nothing before it", () => {
            const formatter = new util.Logging.SimpleFormatter("{message}");
            const record = createRecord(util.Logging.constants.INFO, "uscan", [1]);
            assert.deepStrictEqual(formatter.formatArgs(record, "css"), ["%s", "hello world", 1]);
            const literal = new util.Logging.Record("100% %s", 20, "uscan", [1]);
            assert.deepStrictEqual(formatter.formatArgs(literal, "css"), ["%s", "100% %s", 1]);
            const single = createRecord(util.Logging.constants.INFO, "uscan");
            assert.deepStrictEqual(formatter.formatArgs(single, "css"), ["hello world"]);
        });
        it("should keep the messages that are not strings inspectable", () => {
            const formatter = new util.Logging.SimpleFormatter("{message}");
            const message = { key: "value" };
            const record = new util.Logging.Record(message, 20, "uscan", [1]);
            const args = formatter.formatArgs(record, "css");
            assert.deepStrictEqual(args, [message, 1]);
            assert.strictEqual(args[0], message);
        });
        it("should escape the percent signs interpreted as a format", () => {
            const colors = util.Logging.SimpleFormatter.COLORS.css;
            const formatter = new util.Logging.SimpleFormatter("100% {name} {message}");
            const record = createRecord(util.Logging.constants.INFO, "50%c");
            assert.deepStrictEqual(formatter.formatArgs(record, "css"), [
                "100%% %c50%%c%c",
                util.Logging.SimpleFormatter.selectColor("50%c", colors.name),
                "",
                "hello world"
            ]);
        });
        it("should not escape the percent signs when nothing follows", () => {
            const formatter = new util.Logging.SimpleFormatter("{level} 100%");
            const record = createRecord(util.Logging.constants.INFO, "uscan");
            assert.deepStrictEqual(formatter.formatArgs(record, "ansi"), [
                "\u001b[1;36mINFO\u001b[0m 100%"
            ]);
        });
        it("should keep the unknown options and braces of the format", () => {
            const colors = util.Logging.SimpleFormatter.COLORS.css;
            const formatter = new util.Logging.SimpleFormatter("{unknown} {{level} {message}");
            const record = createRecord(util.Logging.constants.INFO, "uscan");
            assert.deepStrictEqual(formatter.formatArgs(record, "css"), [
                "undefined {%c INFO %c",
                colors.level.INFO,
                "",
                "hello world"
            ]);
        });
    });

    describe("#getOptions()", function() {
        it("should retrieve the options of the record", () => {
            const formatter = new util.Logging.SimpleFormatter();
            const record = createRecord(util.Logging.constants.CRITICAL, "uscan", [1]);
            assert.deepStrictEqual(formatter.getOptions(record), {
                level: "CRITICAL",
                asctime: "2026-01-02 03:04:05,006",
                name: "uscan",
                message: "hello world"
            });
        });
        it("should retrieve the options without padStart and repeat", () => {
            const formatter = new util.Logging.SimpleFormatter();
            const record = createRecord(util.Logging.constants.CRITICAL, "uscan", [1]);
            const padStart = String.prototype.padStart;
            const repeat = String.prototype.repeat;
            delete String.prototype.padStart;
            delete String.prototype.repeat;
            let options = null;
            try {
                options = formatter.getOptions(record);
            } finally {
                // eslint-disable-next-line no-extend-native
                String.prototype.padStart = padStart;
                // eslint-disable-next-line no-extend-native
                String.prototype.repeat = repeat;
            }
            assert.strictEqual(options.asctime, "2026-01-02 03:04:05,006");
        });
    });
});
