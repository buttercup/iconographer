"use strict";

var Iconographer = require("./Iconographer.js");

var __ic = void 0;

/**
 * Get the icon data from a page URL
 * @param {String} url The target page URL
 * @returns {Promise.<Buffer|null>} A promise that resolves with a buffer containing the icon or
 *  null if no icon was found
 */
function getIconForURL(url) {
    var ic = getIconographerInstance();
    return ic.getIconForURL(url).then(function (iconData) {
        if (!iconData) {
            return processAndGetIcon(ic, url);
        }
        return iconData;
    });
}

function getIconographerInstance() {
    if (!__ic) {
        __ic = new Iconographer();
    }
    return __ic;
}

function processAndGetIcon(ic, url) {
    return ic.processIconForURL(url).then(function (succeeded) {
        if (succeeded) {
            return ic.getIconForURL(url).catch(function (err) {
                console.error(err);
            });
        }
        return null;
    });
}

function setIconographerInstance(ic) {
    __ic = ic;
}

module.exports = {
    getIconographerInstance: getIconographerInstance,
    getIconForURL: getIconForURL,
    setIconographerInstance: setIconographerInstance
};