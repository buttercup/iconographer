const convert = require("xml-js");
const { getDataFetcher, getTextFetcher } = require("./fetch.js");

function fetchIconData(iconURL) {
    const fetch = getDataFetcher();
    return fetch(iconURL);
}

function fetchLinkAttributes(linkHTML) {
    const sanitisedHTML = `${linkHTML}</link>`; // links are crap
    const struct = convert.xml2js(sanitisedHTML, {compact: true, ignoreText: true});
    return struct && struct.link && struct.link._attributes || {};
}

function getIcon(url) {
    return getIcons(url)
        .then(icons => {
            // select largest icon (first)
            const [icon] = icons;
            if (icon) {
                return fetchIconData(icon.url)
                    .then(data => Object.assign(icon, { data }));
            }
            return null;
        });
}

function getIcons(url) {
    return getRawLinks(url)
        .then(links => {
            const icons = links
                .filter(link =>
                    /(apple-touch-icon|^icon$)/.test(link.rel || "") &&
                    /^https?:\/\//i.test(link.href)
                )
                .map(link => ({
                    url: link.href,
                    size: processIconSize(link.sizes)
                }));
            return icons.sort((iconA, iconB) => {
                if (iconA.size > iconB.size) {
                    return -1;
                } else if (iconB.size > iconA.size) {
                    return 1;
                }
                return 0;
            });
        });
}

function getRawLinks(url) {
    const linkRexp = /<link("([^"]|\\")+"|[\sa-z0-9=:-]+)+>/ig;
    return getPageSource(url)
        .then(source => {
            const linkEls = [];
            let match;
            while (match = linkRexp.exec(source)) {
                linkEls.push(match[0]);
            }
            return linkEls.map(linkEl => fetchLinkAttributes(linkEl));
        });
}

function getPageSource(url) {
    const fetch = getTextFetcher();
    return fetch(url);
}

function processIconSize(size) {
    const targetSize = size || "";
    const [width] = targetSize.split(/x/i);
    return width && parseInt(width, 10) || 0;
}

module.exports = {
    getIcon
};
