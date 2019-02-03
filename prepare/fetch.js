const nodeFetch = require("node-fetch");

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36";

let __dataFetcher, __textFetcher;

/**
 * Fetch data from a URL and return a buffer
 * @param {String} url The URL to fetch
 * @returns {Promise.<Buffer>} A promise that resolves with the data in a buffer
 */
function fetchData(url) {
    return nodeFetch(url, {
        headers: {
            "User-Agent": USER_AGENT
        },
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
        headers: {
            "User-Agent": USER_AGENT
        },
        timeout: 10000
    };
    return nodeFetch(url, opts)
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
