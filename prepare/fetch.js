const nodeFetch = require("node-fetch");
const { followHTTPRedirect } = require("./redirect.js");

let __dataFetcher, __textFetcher;

/**
 * Fetch data from a URL and return a buffer
 * @param {String} url The URL to fetch
 * @returns {Promise.<Buffer>} A promise that resolves with the data in a buffer
 */
function fetchData(url) {
    return nodeFetch(url, {
        timeout: 15000
    }).then(res => res.buffer());
}

/**
 * Fetch text from a URL
 * @param {String} url The URL to fetch
 * @returns {Promise.<String>} A promise that resolves with the fetched text
 */
function fetchText(url) {
    const opts = {
        timeout: 10000
    };
    return nodeFetch(url, opts)
        .then(res => followHTTPRedirect(res, url, opts))
        .then(res => res.text());
}

function getDataFetcher() {
    return __dataFetcher || fetchData;
}

function getTextFetcher() {
    return __textFetcher || fetchText;
}

/**
 * Set the data fetching function
 * @see fetchData
 * @param {Function|undefined} fn The function to use or undefined to reset
 */
function setDataFetcher(fn) {
    __dataFetcher = fn;
}

/**
 * Set the text fetching function
 * @see fetchText
 * @param {Function|undefined} fn The function to use or undefined to reset
 */
function setTextFetcher(fn) {
    __textFetcher = fn;
}

module.exports = {
    getDataFetcher,
    getTextFetcher,
    setDataFetcher,
    setTextFetcher
};
