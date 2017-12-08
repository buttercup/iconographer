"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// const convert = require("xml-js");
var _require = require("parse5"),
    parseFragment = _require.parseFragment;

var _require2 = require("url"),
    resolveURL = _require2.resolve;

var _require3 = require("./fetch.js"),
    getDataFetcher = _require3.getDataFetcher,
    getTextFetcher = _require3.getTextFetcher;

/**
 * Processed icon information
 * @typedef {Object} ProcessedIcon
 * @property {Buffer} data - The icon's data
 * @property {String} url - URL of the icon
 * @property {Number} size - Size of the icon (width == height)
 */

function fetchIconData(iconURL) {
    var fetch = getDataFetcher();
    return fetch(iconURL);
}

function fetchLinkAttributes(linkHTML) {
    // const sanitisedHTML = linkHTML.trim().replace(/\/?>$/, "></link>");
    // console.log("LINKEROOS", sanitisedHTML);
    // const struct = convert.xml2js(sanitisedHTML, { compact: true, ignoreText: true });
    var struct = parseFragment(linkHTML).childNodes[0];
    var attributes = struct && struct.attrs && struct.attrs.reduce(function (output, nextAttr) {
        output[nextAttr.name] = nextAttr.value;
        return output;
    }, {}) || {};
    return attributes;
}

/**
 * Get an icon from a page
 * @param {String} url The page URL
 * @returns {Promise.<ProcessedIcon|null>} A promise that resolves with icon information, or null
 */
function getIcon(url) {
    return getIcons(url).then(function (icons) {
        // select largest icon (first)
        var _icons = _slicedToArray(icons, 1),
            icon = _icons[0];

        if (icon) {
            return fetchIconData(icon.url).then(function (data) {
                return Object.assign(icon, { data: data });
            });
        }
        return null;
    });
}

function getIcons(url) {
    return getRawLinks(url).then(function (links) {
        var icons = links.filter(function (link) {
            return (/(apple-touch-icon|^icon$)/.test(link.rel || "")
            );
        }).map(function (link) {
            return {
                url: processIconHref(url, link.href),
                size: processIconSize(link.sizes)
            };
        });
        return icons.sort(function (iconA, iconB) {
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
    var linkRexp = /<link("([^"]|\\")+"|[\sa-z0-9=/:-]+)+>/gi;
    return getPageSource(url).then(function (source) {
        var linkEls = [];
        var match = void 0;
        while (match = linkRexp.exec(source)) {
            linkEls.push(match[0]);
        }
        return linkEls.map(function (linkEl) {
            return fetchLinkAttributes(linkEl);
        });
    });
}

function getPageSource(url) {
    var fetch = getTextFetcher();
    return fetch(url);
}

function processIconHref(page, url) {
    if (/^https?:\/\//i.test(url) !== true) {
        return resolveURL(page, url);
    }
    return url;
}

function processIconSize(size) {
    var targetSize = size || "";

    var _targetSize$split = targetSize.split(/x/i),
        _targetSize$split2 = _slicedToArray(_targetSize$split, 1),
        width = _targetSize$split2[0];

    return width && parseInt(width, 10) || 0;
}

module.exports = {
    fetchIconData: fetchIconData,
    fetchLinkAttributes: fetchLinkAttributes,
    getIcon: getIcon,
    getIcons: getIcons
};