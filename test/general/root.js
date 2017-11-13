var assert = require("assert");
require("../../");

describe("Object", function() {
    describe("#isEmpty()", function() {
        it("should check simple static objects", () => {
            assert.equal(Object.isEmpty({}), true);
            assert.equal(Object.isEmpty({
                hello: "world"
            }), false);
        });
    });
});
