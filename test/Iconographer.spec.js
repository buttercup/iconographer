const ChannelQueue = require("@buttercup/channel-queue");
const sleep = require("sleep-promise");
const Iconographer = require("../source/Iconographer.js");
const StorageInterface = require("../source/StorageInterface.js");

const TEST_URL = "https://buttercup.pw";

describe("Iconographer", function() {
    const fakeButtercupEntry = {
        getMeta: key => {
            if (/url/i.test(key)) {
                return TEST_URL;
            }
            return null;
        }
    };

    it("instantiates without error", function() {
        expect(() => {
            new Iconographer();
        }).to.not.throw();
    });

    describe("get:queue", function() {
        beforeEach(function() {
            this.ic = new Iconographer();
        });

        it("is set to a channel queue on construction", function() {
            expect(this.ic.queue).to.be.an.instanceof(ChannelQueue);
        });
    });

    describe("get:storageInterface", function() {
        beforeEach(function() {
            this.ic = new Iconographer();
        });

        it("is set to a storage interface on construction", function() {
            expect(this.ic.storageInterface).to.be.an.instanceof(StorageInterface);
        });
    });

    describe("emitAsync", function() {
        beforeEach(function() {
            this.ic = new Iconographer();
        });

        it("emits events asynchronously", function() {
            sinon.stub(this.ic, "emit");
            this.ic.emitAsync("test:event", 123);
            expect(this.ic.emit.notCalled).to.be.true;
            return sleep(50).then(() => {
                expect(this.ic.emit.calledOnce).to.be.true;
                expect(this.ic.emit.calledWithExactly("test:event", 123)).to.be.true;
            });
        });
    });

    describe("getIconForEntry", function() {
        beforeEach(function() {
            this.ic = new Iconographer();
            sinon.stub(this.ic, "getIconForURL");
        });

        it("calls getIconForURL with the correct URL", function() {
            this.ic.getIconForEntry(fakeButtercupEntry);
            expect(this.ic.getIconForURL.calledOnce).to.be.true;
            expect(this.ic.getIconForURL.calledWithExactly(TEST_URL)).to.be.true;
        });
    });
});
