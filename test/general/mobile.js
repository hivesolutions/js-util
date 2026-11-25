const assert = require("assert");
const util = require("../../");

const element = (attributes = {}, parentNode = null, tagName = "DIV") => ({
    tagName: tagName,
    parentNode: parentNode,
    dispatched: [],
    getAttribute: name => (name in attributes ? attributes[name] : null),
    dispatchEvent: function(event) {
        this.dispatched.push(event.type);
    }
});

const touch = (type, target) => ({
    type: type,
    changedTouches: [{ target: target, screenX: 1, screenY: 2, clientX: 3, clientY: 4 }]
});

describe("Mobile", function() {
    describe("#touchHandler()", function() {
        let createEvent;
        let window;

        beforeEach(() => {
            createEvent = global.document.createEvent;
            window = global.window;
            global.window = global.window || {};
            global.document.createEvent = () => ({
                initMouseEvent(type) {
                    this.type = type;
                }
            });
        });

        afterEach(() => {
            global.document.createEvent = createEvent;
            if (window === undefined) delete global.window;
            else global.window = window;
        });

        it("should emulate the mouse events of the touches", () => {
            const target = element();
            util.Mobile.touchHandler(touch("touchstart", target));
            util.Mobile.touchHandler(touch("touchmove", target));
            util.Mobile.touchHandler(touch("touchend", target));
            util.Mobile.touchHandler(touch("touchcancel", target));
            assert.deepStrictEqual(target.dispatched, ["mousedown", "mousemove", "mouseup"]);
        });

        it("should not emulate mouse events inside a native element", () => {
            const slideshow = element({ "data-touch": "native" });
            const container = element({}, slideshow);
            const image = element({}, container, "IMG");
            util.Mobile.touchHandler(touch("touchstart", image));
            util.Mobile.touchHandler(touch("touchmove", image));
            util.Mobile.touchHandler(touch("touchend", image));
            util.Mobile.touchHandler(touch("touchstart", slideshow));
            assert.deepStrictEqual(image.dispatched, []);
            assert.deepStrictEqual(slideshow.dispatched, []);
        });

        it("should keep emulating next to a native element", () => {
            const page = element();
            element({ "data-touch": "native" }, page);
            const sibling = element({}, page, "SPAN");
            util.Mobile.touchHandler(touch("touchmove", sibling));
            assert.deepStrictEqual(sibling.dispatched, ["mousemove"]);
        });
    });

    describe("#isNative()", function() {
        it("should accept an element marked as native", () => {
            const result = util.Mobile.isNative(element({ "data-touch": "native" }));
            assert.strictEqual(result, true);
        });

        it("should accept the descendants of a native element", () => {
            const slideshow = element({ "data-touch": "native" });
            const image = element({}, element({}, slideshow), "IMG");
            assert.strictEqual(util.Mobile.isNative(image), true);
        });

        it("should reject the other values of the attribute", () => {
            const result = util.Mobile.isNative(element({ "data-touch": "emulated" }));
            assert.strictEqual(result, false);
        });

        it("should reject an element with no native ancestor", () => {
            const image = element({}, element({}, element()), "IMG");
            assert.strictEqual(util.Mobile.isNative(image), false);
        });

        it("should stop at a node without attributes", () => {
            const document = { parentNode: null };
            const image = element({}, element({}, document), "IMG");
            assert.strictEqual(util.Mobile.isNative(image), false);
        });

        it("should reject a missing element", () => {
            assert.strictEqual(util.Mobile.isNative(null), false);
            assert.strictEqual(util.Mobile.isNative(undefined), false);
        });
    });
});
