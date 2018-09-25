const assert = require("assert");
require("../../");

describe("Object", function() {
    describe("#isEmpty()", function() {
        it("should check simple static objects", () => {
            assert.strictEqual(Object.isEmpty({}), true);
            assert.strictEqual(
                Object.isEmpty({
                    hello: "world"
                }),
                false
            );
        });
    });
});
