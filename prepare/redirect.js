const { URL } = require("url");
const nodeFetch = require("node-fetch");
const parseMetaRefresh = require("http-equiv-refresh");
const { parseFragment } = require("parse5");

function followHTTPRedirect(fetchResponse, url, opts = {}) {
    if (/text\/html/.test(fetchResponse.headers.get("content-type"))) {
        const originalResponse = fetchResponse.clone();
        return fetchResponse
            .text()
            .then(src => {
                const redirInfo = getRedirectInformation(src);
                if (redirInfo) {
                    const redirURL = new URL(redirInfo.url, url);
                    return nodeFetch(redirURL.href, opts);
                }
                return originalResponse;
            });
    }
    return Promise.resolve(fetchResponse);
}

function getRedirectInformation(source) {
    const metaExp = /<meta[^>]+http-equiv[^>]*(\/>|>)/gi;
    let match;
    while ((match = metaExp.exec(source)) !== null) {
        const attrs = parseElementAttributes(match[0]);
        if (/refresh/i.test(attrs["http-equiv"])) {
            return parseMetaRefresh(attrs.content);
        }
    }
    return null;
}

function parseElementAttributes(linkHTML) {
    const struct = parseFragment(linkHTML).childNodes[0];
    const attributes =
        (struct &&
            struct.attrs &&
            struct.attrs.reduce((output, nextAttr) => {
                output[nextAttr.name] = nextAttr.value;
                return output;
            }, {})) ||
        {};
    return attributes;
}

module.exports = {
    followHTTPRedirect
};
