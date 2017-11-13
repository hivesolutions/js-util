var assert = require("assert");
var util = require("../../");

describe("Md5", function() {
    describe("#digest()", function() {
        it("should be able to hash an hello string", () => {
            assert.equal(util.Md5.digest("hello world"), "5eb63bbbe01eeed093cb22bb8f5acdc3");
        });
    });
});
