const path = require("path");
const fs = require("fs");
const { encode: encodeDataURI } = require("strong-data-uri");

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

function getIconDetails(domain, { grey = false } = {}) {
    const { domains, match } = require("../resources/index.json");
    const domainKey = domain.toLowerCase();
    let filename,
        isDefault = false;
    if (domains[domainKey]) {
        const { filename: imageFilename, filenameGreyscale: imageFilenameGrey } = domains[domainKey];
        filename = grey ? imageFilenameGrey : imageFilename;
        filename = path.resolve(__dirname, "../resources/images/", filename);
    } else {
        isDefault = true;
        filename = grey ? "default.grey.png" : "default.png";
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
