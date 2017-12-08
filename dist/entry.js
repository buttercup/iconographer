"use strict";

function getEntryURL(entry) {
    var url = [entry.getMeta("iconurl"), entry.getMeta("url"), entry.getMeta("loginurl")].find(Boolean);
    if (url) {
        if (!/^(http(s?):\/\/)/.test(url)) {
            url = "https://" + url;
        }
        return url;
    }
    return null;
}

module.exports = {
    getEntryURL: getEntryURL
};