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

    describe("getIconForURL", function() {
        beforeEach(function() {
            this.data = Buffer.from([1, 2, 3]);
            this.ic = new Iconographer();
            sinon.stub(this.ic.storageInterface, "retrieveIcon").returns(Promise.resolve(this.data));
            sinon.stub(this.ic.storageInterface, "decodeIconFromStorage").returnsArg(0);
        });

        it("returns the stored data", function() {
            return expect(this.ic.getIconForURL(TEST_URL)).to.eventually.equal(this.data);
        });

        it("requests the icon from the storage interface", function() {
            return this.ic.getIconForURL(TEST_URL).then(() => {
                expect(this.ic.storageInterface.retrieveIcon.calledOnce).to.be.true;
                expect(this.ic.storageInterface.retrieveIcon.calledWithExactly(TEST_URL)).to.be.true;
            });
        });

        it("decodes the data using the storage interface", function() {
            return this.ic.getIconForURL(TEST_URL).then(() => {
                expect(this.ic.storageInterface.decodeIconFromStorage.calledOnce).to.be.true;
                expect(this.ic.storageInterface.decodeIconFromStorage.calledWithExactly(this.data)).to.be.true;
            });
        });
    });

    describe("processIconForEntry", function() {
        beforeEach(function() {
            this.ic = new Iconographer();
            sinon.stub(this.ic, "processIconForURL");
        });

        it("calls processIconForURL with the correct URL", function() {
            this.ic.processIconForEntry(fakeButtercupEntry);
            expect(this.ic.processIconForURL.calledOnce).to.be.true;
            expect(this.ic.processIconForURL.calledWithExactly(TEST_URL)).to.be.true;
        });
    });

    describe("processIconForURL", function() {
        const sampleOutput = {
            data: new Buffer([1, 2, 3]),
            url: "https://test.com/favicon.ico",
            size: 16
        };

        beforeEach(function() {
            this.ic = new Iconographer();
            this.stubFetching = (output = sampleOutput) => {
                sinon.stub(this.ic, "fetchIconDataForPage").returns(Promise.resolve(output));
            };
        });

        it("fetches the icon", function() {
            this.stubFetching();
            return this.ic.processIconForURL("https://test.com").then(() => {
                expect(this.ic.fetchIconDataForPage.calledWithExactly("https://test.com")).to.be.true;
                expect(this.ic.fetchIconDataForPage.calledOnce).to.be.true;
            });
        });

        it("returns true if the download was successful", function() {
            this.stubFetching();
            return this.ic.processIconForURL("https://test.com").then(result => {
                expect(result).to.be.true;
            });
        });

        it("queues the download and storing of icons", function() {
            this.stubFetching();
            sinon.spy(this.ic.downloadChannel, "enqueue");
            sinon.spy(this.ic.storeChannel, "enqueue");
            return this.ic.processIconForURL("https://test.com").then(() => {
                expect(this.ic.downloadChannel.enqueue.calledOnce).to.be.true;
                expect(this.ic.storeChannel.enqueue.calledOnce).to.be.true;
                expect(this.ic.downloadChannel.enqueue.calledBefore(this.ic.storeChannel.enqueue)).to.be.true;
            });
        });

        it("emits an event for success", function() {
            this.stubFetching();
            sinon.spy(this.ic, "emitAsync");
            return this.ic.processIconForURL("https://test.com").then(() => {
                expect(this.ic.emitAsync.calledWithExactly("iconAdded", "https://test.com")).to.be.true;
                expect(this.ic.emitAsync.calledWithExactly("iconFetchFailed", "https://test.com")).to.be.false;
            });
        });

        it("emits an event for failure", function() {
            this.stubFetching(null);
            sinon.spy(this.ic, "emitAsync");
            return this.ic.processIconForURL("https://test.com").then(() => {
                expect(this.ic.emitAsync.calledWithExactly("iconAdded", "https://test.com")).to.be.false;
                expect(this.ic.emitAsync.calledWithExactly("iconFetchFailed", "https://test.com")).to.be.true;
            });
        });

        it("encodes the icon before storage", function() {
            this.stubFetching();
            sinon.spy(this.ic.storageInterface, "encodeIconForStorage");
            sinon.spy(this.ic.storageInterface, "storeIcon");
            return this.ic.processIconForURL("https://test.com").then(() => {
                expect(this.ic.storageInterface.encodeIconForStorage.calledWithExactly(sampleOutput.data)).to.be.true;
                expect(this.ic.storageInterface.storeIcon.calledOnce).to.be.true;
                expect(this.ic.storageInterface.encodeIconForStorage.calledBefore(this.ic.storageInterface.storeIcon))
                    .to.be.true;
            });
        });
    });
});
