function getEntryURL(entry) {
    const url = [entry.getMeta("iconurl"), entry.getMeta("url"), entry.getMeta("loginurl")].find(Boolean);
    return url || null;
}

module.exports = {
    getEntryURL
};
