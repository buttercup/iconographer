const { getIconDataURI, getIconDetails, getIconFilename, iconExists } = require("../source/index.js");

describe("iconographer", function() {
    describe("getIconDataURI", function() {
        it("returns a valid data URI for existing domains", function() {
            const dataURIPromise = getIconDataURI("amazon.com");
            return expect(dataURIPromise).to.eventually.match(/^data:image\/png;base64,/);
        });

        it("returns a valid data URI for non-existing domains", function() {
            const dataURIPromise = getIconDataURI("perrymitchell.net");
            return expect(dataURIPromise).to.eventually.match(/^data:image\/png;base64,/);
        });
    });

    describe("getIconDetails", function() {
        it("returns the correct details for existing domains", function() {
            const details = getIconDetails("qq.com");
            expect(details)
                .to.have.property("filename")
                .that.matches(/qq_com\.png$/);
            expect(details).to.have.property("isDefault", false);
        });

        it("returns the correct details for non-existing domains", function() {
            const details = getIconDetails("perrymitchell.net");
            expect(details)
                .to.have.property("filename")
                .that.matches(/default\.png$/);
            expect(details).to.have.property("isDefault", true);
        });
    });

    describe("getIconFilename", function() {
        it("returns the correct filename for existing domains", function() {
            const filename = getIconFilename("qq.com");
            expect(filename).to.match(/qq_com\.png$/);
        });

        it("returns the correct filename for existing domains in greyscale", function() {
            const filename = getIconFilename("qq.com", { greyscale: true });
            expect(filename).to.match(/qq_com\.grey\.png$/);
        });

        it("returns the correct filename for existing domains when tested from a subdomain", function() {
            const filename = getIconFilename("sub.qq.com");
            expect(filename).to.match(/qq_com\.png$/);
        });

        it("returns the correct filename for non-existing domains", function() {
            const filename = getIconFilename("perrymitchell.net");
            expect(filename).to.match(/default\.png$/);
        });
    });

    describe("iconExists", function() {
        it("returns true for existing icons", function() {
            expect(iconExists("plex.tv")).to.be.true;
        });

        it("returns true for existing icons on subdomains", function() {
            expect(iconExists("login.auth.plex.tv")).to.be.true;
        });

        it("returns false for non-existing icons", function() {
            expect(iconExists("perrymitchell.net")).to.be.false;
        });
    });
});
