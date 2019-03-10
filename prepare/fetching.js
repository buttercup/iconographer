const fileType = require("file-type");
const { parseFragment } = require("parse5");
const { parse: parseURL, resolve: resolveURL } = require("url");
const getFavicons = require("get-website-favicon");
const { convertFetchedIconToPNG, convertICOToPNG } = require("./converting.js");
const { getDataFetcher, getTextFetcher } = require("./fetch.js");

const ICON_REL = /(apple-touch-icon|fluid-icon|\bicon\b)/;
const ICON_REL_BLACKLIST = /(mask-icon)/;
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
function getIcon(domain) {
    return getIcons(domain)
        .then(icons => {
            // select largest icon (first)
            const [icon] = icons;
            if (!icon) {
                throw new Error(`No icons available for URL: ${url}`);
            }
            return icon;
        });
}

function getIcons(domain) {
    let url;
    return resolvePageURL(domain)
        .then(resolvedURL => {
            url = resolvedURL;
        })
        .then(() => getPageSource(url))
        .then(source => Promise.all([
            getRawLinks(source).filter(link => ICON_REL.test(link.rel || "") && !ICON_REL_BLACKLIST.test(link.rel || "")),
            getRawMeta(source),
            getFavicons(url)
        ]))
        .then(([links, meta, favicons]) => [
            ...links.map(processLinkEl),
            ...meta.map(processMetaEl),
            ...favicons.icons.map(processFavicon)
        ])
        .then(icons => [
            ...icons,
            { url: `${getBaseURL(url)}/favicon.ico` },
            { url: `${getBaseURL(url)}/apple-touch-icon.png` }
        ])
        .then(icons => icons.filter(icon => !!icon))
        .then(icons => icons.map(icon => Object.assign(icon, {
            url: processIconHref(url, icon.url),
            domain
        })))
        .then(icons => Promise.all(icons.map(icon => {
            return fetchIconData(icon.url)
                .then(buff => {
                    const dataType = guessDataType(icon.url) || fileType(buff);
                    if (!dataType || EXT_WHITELIST.indexOf(dataType.ext) === -1) {
                        throw new Error(`Invalid data type for icon: ${icon.url}`);
                    }
                    return Object.assign(icon, dataType, {
                        data: buff
                    });
                })
                .then(icon => convertFetchedIconToPNG(icon))
                .catch(err => {
                    console.error(`Failed getting icon at URL: ${icon.url}`, err);
                    icon.data = null;
                    return icon;
                });
        })))
        .then(icons => icons.filter(icon => !!icon.data && icon.square))
        .then(icons => sortIcons(icons));
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

function guessDataType(url) {
    if (/\.ico$/i.test(url)) {
        return {
            ext: "ico",
            mime: "image/x-icon"
        };
    } else if (/\.svg$/i.test(url)) {
        return {
            ext: "svg",
            mime: "image/svg+xml"
        };
    }
    return null;
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

function processFavicon(extFavicon) {
    return {
        url: extFavicon.src,
        size: processIconSize(extFavicon.sizes)
    };
}

function processLinkEl(linkEl) {
    return {
        url: linkEl.href,
        size: processIconSize(linkEl.sizes)
    };
}

function processMetaEl(metaEl) {
    if (!metaEl.content) {
        return null;
    }
    let size = -1;
    const match = /(\d+x\d+)/.exec(metaEl.content);
    if (match) {
        const [width, height] = match[1].split(/x/i).map(p => parseInt(p, 10));
        size = width === height ? width : size;
    }
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
        .catch(err => {
            console.warn(`Page at URL not available (protocol): ${url} (${err.message})`);
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

function sortIcons(icons) {
    return icons.sort((iconA, iconB) => {
        if (iconA.originalExt === "svg" && iconB.originalExt !== "svg") {
            return 1;
        } else if (iconB.originalExt === "svg" && iconA.originalExt !== "svg") {
            return -1;
        }
        return iconB.originalSize - iconA.originalSize;
    });
}

module.exports = {
    fetchIconData,
    fetchElementAttributes,
    getIcon,
    getIcons,
    resolvePageURL
};
