const assert = require("assert");
require("../../");

describe("String", function() {
    describe("#trim()", function() {
        it("should be able to trim a simple string", () => {
            assert.strictEqual("hello  ".trim(), "hello");
            assert.strictEqual(" hello  ".trim(), "hello");
        });
    });
    describe("#startsWith()", function() {
        it("should be able to detect starting on a simple string", () => {
            assert.strictEqual("hello  ".startsWith("hello"), true);
            assert.strictEqual("hello  ".startsWith("world"), false);
        });
    });
    describe("#padStart()", function() {
        it("should be able to pad start a simple string", () => {
            assert.strictEqual("1".padStart(2, "0"), "01");
            assert.strictEqual("1".padStart(3, "0"), "001");
        });
    });
    describe("#padEnd()", function() {
        it("should be able to pad end a simple string", () => {
            assert.strictEqual("1".padEnd(2, "0"), "10");
            assert.strictEqual("1".padEnd(3, "0"), "100");
        });
    });
    describe("#capitalize()", function() {
        it("should be able to capitalize a simple string", () => {
            assert.strictEqual("hello".capitalize(), "Hello");
        });
    });
    describe("#decapitalize()", function() {
        it("should decapitalize a simple string", () => {
            assert.strictEqual("Hello".decapitalize(), "hello");
        });
    });
    describe("#format()", function() {
        it("should properly format a string", () => {
            assert.strictEqual(
                "{0} {1}".format("Hello", "World"),
                "Hello World"
            );
            assert.strictEqual(
                String.format("{0} {1}", "Hello", "World"),
                "Hello World"
            );
        });
    });
    describe("#formatOptions()", function() {
        it("should properly format a string with options", () => {
            assert.strictEqual(
                "{hello} {world}".formatOptions({
                    hello: "Hello",
                    world: "World"
                }),
                "Hello World"
            );
            assert.strictEqual(
                String.formatOptions("{hello} {world}", {
                    hello: "Hello",
                    world: "World"
                }),
                "Hello World"
            );
        });
    });
});
