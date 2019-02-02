const fileType = require("file-type");
const { parseFragment } = require("parse5");
const { parse: parseURL, resolve: resolveURL } = require("url");
const { getDataFetcher, getTextFetcher } = require("./fetch.js");

const ICON_REL = /(apple-touch-icon|\bicon\b)/;
const EXT_WHITELIST = ["jpg", "png", "gif", "ico", "bmp", "svg"];

/**
 * Processed icon information
 * @typedef {Object} ProcessedIcon
 * @property {Buffer} data - The icon's data
 * @property {String} url - URL of the icon
 * @property {Number} size - Size of the icon (width == height)
 * @property {String} ext - The file extension
 * @property {String} mime - The file's MIME type
 */

function fetchIconData(iconURL) {
    const fetch = getDataFetcher();
    return fetch(iconURL).catch(err => null);
}

function fetchElementAttributes(linkHTML) {
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

function getBaseURL(url) {
    const { protocol, host } = parseURL(url);
    return `${protocol}//${host}`;
}

/**
 * Get an icon from a page
 * Resolves the URL before processing
 * @param {String} url The page URL
 * @returns {Promise.<ProcessedIcon|null>} A promise that resolves with icon information, or null
 */
function getIcon(url) {
    return resolvePageURL(url)
        .then(resolvedURL => getIcons(resolvedURL))
        .then(icons => {
            // select largest icon (first)
            const [icon] = icons;
            if (icon) {
                console.log(`  Trying: ${icon.url}`);
                return fetchIconData(icon.url).then(data => {
                    const dataType = fileType(data);
                    if (dataType !== null && EXT_WHITELIST.indexOf(dataType.ext) > -1) {
                        return Object.assign(icon, { data }, dataType);
                    }
                    return null;
                });
            }
            return null;
        });
}

function getIcons(url) {
    return getPageSource(url)
        .then(source => Promise.all([
            getRawLinks(source).filter(link => ICON_REL.test(link.rel || "")),
            getRawMeta(source)
        ]))
        .then(([links, meta]) => [
            ...links.map(processLinkEl),
            ...meta.map(processMetaEl)
        ])
        .then(icons => icons.map(icon => Object.assign(icon, {
            url: processIconHref(url, icon.url)
        })))
        .then(icons => {
            icons.push({
                url: `${getBaseURL(url)}/favicon.ico`,
                size: 0
            });
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

function getRawLinks(source) {
    const linkRexp = /<link(\s|[^\s>]+)+(\/>|>)/gi;
    const linkEls = [];
    let match;
    while ((match = linkRexp.exec(source))) {
        linkEls.push(match[0]);
    }
    return linkEls.map(linkEl => fetchElementAttributes(linkEl));
}

function getRawMeta(source) {
    const metaExp = /<meta[^>]+property="og:image"[^>]*(\/>|>)/gi;
    const metaEls = [];
    let match;
    while ((match = metaExp.exec(source))) {
        metaEls.push(match[0]);
    }
    return metaEls.map(metaEl => fetchElementAttributes(metaEl));
}

function getPageSource(url) {
    const fetch = getTextFetcher();
    return fetch(url);
}

function processIconHref(page, url) {
    if (/^https?:\/\//i.test(url) !== true) {
        return resolveURL(page, url);
    }
    return url;
}

function processIconSize(size) {
    const targetSize = size || "";
    const [width] = targetSize.split(/x/i);
    return (width && parseInt(width, 10)) || 0;
}

function processLinkEl(linkEl) {
    return {
        url: linkEl.href,
        size: processIconSize(linkEl.sizes)
    };
}

function processMetaEl(metaEl) {
    const match = /(\d+x\d+)/.exec(metaEl.content);
    const size = match ? processIconSize(match[1]) : 0;
    return {
        url: metaEl.content,
        size
    };
}

function resolvePageURL(url) {
    let wip = url;
    if (/^https?:\/\//i.test(wip) !== true) {
        wip = `https://${wip}`;
    }
    // Try the initial form first
    return getPageSource(wip)
        .then(() => wip)
        .catch(() => {
            // Request failed, alternate to the other
            const replacement = /^https/i.test(wip) ? "http://" : "https://";
            wip = wip.replace(/^https?:\/\//i, replacement);
            return getPageSource(wip)
                .then(() => wip)
                .catch(() => {
                    throw new Error(`Failed resolving page for URL: ${wip}`);
                });
        });
}

module.exports = {
    fetchIconData,
    fetchElementAttributes,
    getIcon,
    getIcons,
    resolvePageURL
};
