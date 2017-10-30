const Iconographer = require("./Iconographer.js");

let __ic;

/**
 * Get the icon data from a page URL
 * @param {String} url The target page URL
 * @returns {Promise.<Buffer|null>} A promise that resolves with a buffer containing the icon or
 *  null if no icon was found
 */
function getIconForURL(url) {
    const ic = getIconographerInstance();
    return ic.getIconForURL(url).then(iconData => {
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
    return ic.processIconForURL(url).then(succeeded => {
        if (succeeded) {
            return ic.getIconForURL(url).catch(err => {
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
    getIconographerInstance,
    getIconForURL,
    setIconographerInstance
};
