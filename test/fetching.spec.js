const { fetchIconData, fetchLinkAttributes, getIcon, getIcons, resolvePageURL } = require("../source/fetching.js");

const TEST_ICON_URI = "https://buttercup.pw/static/img/buttercup.ico";
const TEST_PAGE_URI = "https://buttercup.pw";
const TEST_PAGE_URI_INCOMPLETE = "buttercup.pw";

describe("fetching", function() {
    describe("fetchIconData", function() {
        it("fetches icon data", function() {
            return fetchIconData(TEST_ICON_URI).then(data => {
                expect(data).to.be.an.instanceof(Buffer);
            });
        });
    });

    describe("fetchLinkAttributes", function() {
        it("fetches the correct attributes", function() {
            const attributes = fetchLinkAttributes('<link rel="icon" size="30x30" href="https://test.com/image.png">');
            expect(attributes).to.deep.equal({
                rel: "icon",
                size: "30x30",
                href: "https://test.com/image.png"
            });
        });
    });

    describe("getIcon", function() {
        it("fetches icon data", function() {
            return getIcon(TEST_PAGE_URI).then(data => {
                expect(data)
                    .to.have.property("url")
                    .that.matches(/^https:\/\/buttercup\.pw/);
                expect(data)
                    .to.have.property("size")
                    .that.is.a("number");
                expect(data)
                    .to.have.property("data")
                    .that.is.an.instanceof(Buffer);
            });
        });

        it("fetches icon data for incomplete URLs", function() {
            return getIcon(TEST_PAGE_URI_INCOMPLETE).then(data => {
                expect(data)
                    .to.have.property("url")
                    .that.matches(/^https:\/\/buttercup\.pw/);
                expect(data)
                    .to.have.property("data")
                    .that.has.length.above(0);
            });
        });
    });

    describe("getIcons", function() {
        it("fetches a batch of icons", function() {
            return getIcons(TEST_PAGE_URI).then(icons => {
                expect(icons).to.be.an("array");
            });
        });
    });

    describe("resolvePageURL", function() {
        it("resolves URLs", function() {
            return expect(resolvePageURL("buttercup.pw")).to.eventually.equal("https://buttercup.pw");
        });
    });
});
