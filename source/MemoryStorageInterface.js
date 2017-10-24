const StorageInterface = require("./StorageInterface.js");

/**
 * Icon storage interface for in-memory storage of icons
 * @see StorageInterface
 * @augments StorageInterface
 */
class MemoryStorageInterface extends StorageInterface {
    constructor() {
        super();
        this._icons = {};
    }

    get icons() {
        return this._icons;
    }

    deleteIcon(iconKey) {
        delete this.icons[iconKey];
        return Promise.resolve();
    }

    getIconKeys() {
        return Object.keys(this.icons);
    }

    retrieveIcon(iconKey) {
        return Promise.resolve(this.icons[iconKey]);
    }

    storeIcon(iconKey, iconData) {
        this.icons[iconKey] = iconData;
        return Promise.resolve();
    }
}

module.exports = MemoryStorageInterface;
