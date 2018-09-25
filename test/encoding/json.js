const assert = require("assert");
const util = require("../../");

describe("Json", function() {
    describe("#toString()", function() {
        it("should dump an object", () => {
            assert.strictEqual(
                util.Json.toString({
                    hello: "world"
                }),
                '{"hello":"world"}'
            );
        });
    });
});
