const nodeFetch = require("node-fetch");

let __dataFetcher,
    __textFetcher;

function fetchData(url) {
    return nodeFetch(url).then(res => res.buffer());
}

function fetchText(url) {
    return nodeFetch(url).then(res => res.text());
}

function getDataFetcher() {
    return __dataFetcher || fetchData;
}

function getTextFetcher() {
    return __textFetcher || fetchText;
}

function setDataFetcher(fn) {
    __dataFetcher = fn;
}

function setTextFetcher(fn) {
    __textFetcher = fn;
}

module.exports = {
    getDataFetcher,
    getTextFetcher,
    setDataFetcher,
    setTextFetcher
};
