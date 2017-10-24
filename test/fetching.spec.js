const { fetchIconData, fetchLinkAttributes, getIcons } = require("../source/fetching.js");

const TEST_ICON_URI = "https://buttercup.pw/static/img/buttercup.ico";
const TEST_PAGE_URI = "https://buttercup.pw";

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

    describe("getIcons", function() {
        it("fetches a batch of icons", function() {
            return getIcons(TEST_PAGE_URI).then(icons => {
                expect(icons).to.be.an("array");
            });
        });
    });
});
