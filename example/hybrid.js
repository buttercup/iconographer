const path = require("path");
const fs = require("fs");
const { getIconForURL, Iconographer, setIconographerInstance, StorageInterface } = require("../source/index.js");

const tempDir = require("temp-dir");

function sanitiseURL(url) {
    return url.replace(/[^a-z0-9_-]+/ig, "_");
}

class FileStorageInterface extends StorageInterface {
    constructor() {
        super();
        this._filenamePrefix = (Math.ceil(Math.random() * 100000)).toString();
    }

    decodeIconFromStorage(data) {
        return Promise.resolve(data.toString("base64"));
    }

    retrieveIcon(key) {
        const filePath = path.join(tempDir, `${this._filenamePrefix}_${sanitiseURL(key)}.png`);
        return new Promise(resolve => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    return resolve(null);
                }
                return resolve(data);
            });
        });
    }

    storeIcon(key, data) {
        const filePath = path.join(tempDir, `${this._filenamePrefix}_${sanitiseURL(key)}.png`);
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, err => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }
}

const ic = new Iconographer();
ic.storageInterface = new FileStorageInterface();
setIconographerInstance(ic);

Promise
    .all([
        getIconForURL("https://buttercup.pw"),
        getIconForURL("https://github.com")
    ])
    .then(([buttercupIco, githubIco]) => {
        console.log("Buttercup website icon: ", buttercupIco.substr(0, 50) + "...");
        console.log("Github website icon:    ", githubIco.substr(0, 50) + "...");
    });
