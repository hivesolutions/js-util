var assert = require("assert");
var md5 = require("../lib/hash/md5");

describe("Md5", function() {
    describe("#digest()", function() {
        it("should do simple things", () => {
            assert.equal(md5.Md5.digest("hello world"), "5eb63bbbe01eeed093cb22bb8f5acdc3");
        });
    });
});
