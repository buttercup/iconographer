const { getEntryURL } = require("../source/entry.js");

describe("entry", () => {
    describe("getEntryURL", () => {
        const expectedURLs = [
            // Input entry URL, output expected URL
            ["buttercup.pw", "https://buttercup.pw"],
            ["https://buttercup.pw", "https://buttercup.pw"],
            ["http://buttercup.pw", "http://buttercup.pw"]
        ];

        expectedURLs.forEach((urls, index) => {
            it(`adds https prefix if URL has no http/https protocol #${index + 1}`, () => {
                const [entryURL, expectedURL] = urls;
                const entry = {
                    getMeta: key => (key === "url" ? entryURL : null)
                };
                expect(getEntryURL(entry)).to.equal(expectedURL);
            });
        });
    });
});
