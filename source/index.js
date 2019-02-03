const path = require("path");
const fs = require("fs");
const { encode: encodeDataURI } = require("strong-data-uri");

function findMatchingDomain(domain, domains, lookup) {
    const domainKey = domain.toLowerCase();
    if (domains.includes(domain)) {
        return domain;
    }
    const innerDomain = domains.find(
        domainToTest =>
            domain.length > domainToTest.length &&
            domain.indexOf(domainToTest) === domain.length - domainToTest.length &&
            domain[domain.indexOf(domainToTest) - 1] === "."
    );
    if (innerDomain) {
        return innerDomain;
    }
    const matchingRecordKey = Object.keys(lookup).find(test => new RegExp(test).test(domain));
    if (matchingRecordKey) {
        return lookup[matchingRecordKey];
    }
    return domain;
}

function getIconDataURI(domain, opts) {
    const readIconProcess = new Promise((resolve, reject) => {
        const iconFilename = getIconFilename(domain, opts);
        fs.readFile(iconFilename, (err, buff) => {
            if (err) {
                return reject(err);
            }
            resolve(buff);
        });
    });
    return readIconProcess.then(iconData => encodeDataURI(iconData, "image/png"));
}

function getIconDetails(domain, { greyscale = false } = {}) {
    const { domains, match } = require("../resources/index.json");
    const domainKey = findMatchingDomain(domain, Object.keys(domains), match);
    let filename,
        isDefault = false;
    if (domains[domainKey]) {
        const { filename: imageFilename, filenameGreyscale: imageFilenameGrey } = domains[domainKey];
        filename = greyscale ? imageFilenameGrey : imageFilename;
        filename = path.resolve(__dirname, "../resources/images/", filename);
    } else {
        isDefault = true;
        filename = greyscale ? "default.grey.png" : "default.png";
        filename = path.resolve(__dirname, "../resources/images/", filename);
    }
    return {
        filename,
        isDefault
    };
}

function getIconFilename(domain, opts) {
    return getIconDetails(domain, opts).filename;
}

function iconExists(domain) {
    return getIconDetails(domain).isDefault === false;
}

module.exports = {
    getIconDataURI,
    getIconDetails,
    getIconFilename,
    iconExists
};
