#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const pAll = require("p-all");
const rimraf = require("rimraf").sync;
const mkdir = require("mkdirp").sync;
const { getIcon } = require("./fetching.js");
const { convertFetchedIconToPNG } = require("./converting.js");
const DOMAINS = require("./domains.json");

const { fetch: domainsToFetch } = DOMAINS;
const OUTPUT = path.resolve(__dirname, "../resources");
const IMAGES = path.join(OUTPUT, "images");

console.log("Preparing...");
rimraf(OUTPUT);
mkdir(OUTPUT);
mkdir(IMAGES);
console.log("Fetching icons...");

const manifest = {};
const failures = [];
const actions = domainsToFetch.map(domain => () => {
    console.log(`Fetching icon: ${domain}`);
    return getIcon(domain)
        .then(icon => {
            if (!icon) {
                throw new Error(`Failed retrieving icon for domain: ${domain}`);
            }
            return convertFetchedIconToPNG(icon);
        })
        .then(icon => Promise.all([
            new Promise((resolve, reject) => {
                const domainFilename = `${domain.replace(/\./g, "_")}.png`;
                fs.writeFile(path.join(IMAGES, domainFilename), icon.data, err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(domainFilename);
                });
            })
        ]))
        .then(([filename]) => {
            manifest[domain] = {
                filename,
                updated: (new Date()).toISOString()
            };
        })
        .catch(err => {
            console.error(err.message);
            failures.push(domain);
        });
});

pAll(actions, { concurrency: 4 })
    .then(() => new Promise((resolve, reject) => {
        fs.writeFile(path.join(OUTPUT, "index.json"), JSON.stringify(manifest), err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }))
    .then(() => {
        if (failures.length > 0) {
            console.error(`Failed to build ${failures.length} domains`);
            process.exit(2);
        }
        console.log("Finished");
    });