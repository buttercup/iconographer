const nodeFetch = require("node-fetch");

let __fetch,
    __responseResolver;

function getFetchMethod() {
    return __fetch || getGlobalFetch() || nodeFetch;
}

function getGlobalFetch() {
    return typeof fetch !== "undefined" ?
        fetch :
        null;
}

function getResponseResolver() {
    return __responseResolver || resolveFetchResponse;
}

function resolveFetchResponse(response, responseType) {
    switch (responseType) {
        case "text":
            return response.text();
        case "buffer":
            return response.arrayBuffer();
        default:
            throw new Error(`An unrecognised response type was requested: ${responseType}`);
    }
}

function setFetchMethod(fn) {
    __fetch = fn;
}

function setResponseResolver(fn) {
    __responseResolver = fn;
}

module.exports = {
    getFetchMethod,
    getResponseResolver,
    setFetchMethod,
    setResponseResolver
};
