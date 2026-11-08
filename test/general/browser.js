const assert = require("assert");

const browserPath = require.resolve("../../lib/general/browser");

const loadBrowser = () => {
    delete require.cache[browserPath];
    require(browserPath);
};

const restoreNavigator = descriptor => {
    if (descriptor) Object.defineProperty(global, "navigator", descriptor);
    else delete global.navigator;
};

describe("Browser", function() {
    describe("#navigator", function() {
        it("should keep a read-only global navigator", () => {
            const descriptor = Object.getOwnPropertyDescriptor(global, "navigator");
            const navigator = { userAgent: "Node.js" };
            Object.defineProperty(global, "navigator", {
                get: () => navigator,
                set: () => {
                    throw new TypeError("Cannot set property navigator which has only a getter");
                },
                configurable: true
            });
            try {
                assert.doesNotThrow(loadBrowser);
                assert.strictEqual(global.navigator, navigator);
            } finally {
                restoreNavigator(descriptor);
            }
        });
        it("should create a navigator when missing", () => {
            const descriptor = Object.getOwnPropertyDescriptor(global, "navigator");
            delete global.navigator;
            try {
                loadBrowser();
                assert.deepStrictEqual(global.navigator, {});
            } finally {
                restoreNavigator(descriptor);
            }
        });
    });
});
