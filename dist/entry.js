"use strict";

function getEntryURL(entry) {
    var url = [entry.getMeta("iconurl"), entry.getMeta("url"), entry.getMeta("loginurl")].find(Boolean);
    return url || null;
}

module.exports = {
    getEntryURL: getEntryURL
};