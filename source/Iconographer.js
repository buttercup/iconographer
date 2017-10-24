const EventEmitter = require("eventemitter3");
const ChannelQueue = require("@buttercup/channel-queue");
const StorageInterface = require("./StorageInterface.js");
const MemoryStorageInterface = require("./MemoryStorageInterface.js");
const { getEntryURL } = require("./entry.js");
const { getIcon } = require("./fetching.js");

/**
 * Buttercup Entry
 * @typedef {Object} Entry
 * @property {Function} getMeta - Fetch meta from the entry
 */

/**
 * Iconographer class for processing icons and managing storage
 * @augments EventEmitter
 */
class Iconographer extends EventEmitter {

    constructor() {
        super();
        this._storageInterface = null;
        this._queue = new ChannelQueue();
    }

    /**
     * Get the channel queue instance
     * @type {ChannelQueue}
     */
    get queue() {
        return this._queue;
    }

    /**
     * Get the storage interface instance
     * @type {StorageInterface}
     */
    get storageInterface() {
        if (!this._storageInterface) {
            this._storageInterface = new MemoryStorageInterface();
        }
        return this._storageInterface;
    }

    set storageInterface(si) {
        if (si instanceof StorageInterface !== true) {
            throw new Error("Unable to set storage interface: provided object not an instance of StorageInterface");
        }
        this._storageInterface = si;
    }

    /**
     * Emit an event asynchronously
     * @param {String} key The event key
     * @param {...*} args The event arguments
     */
    emitAsync(key, ...args) {
        setTimeout(() => {
            this.emit(key, ...args);
        }, 0);
    }

    /**
     * Get icon data for a buttercup entry
     * Requires that the icon was fetched beforehand
     * @see getIconForURL
     * @param {Entry} buttercupEntry The Buttercup entry instance
     * @returns {Promise.<Buffer|null>} A promise that resolves with the buffered
     *  image data or null if there is no such icon
     */
    getIconForEntry(buttercupEntry) {
        const url = getEntryURL(buttercupEntry);
        return url ?
            this.getIconForURL(url) :
            Promise.resolve(null);
    }

    /**
     * Retrieve icon data for a specific page URL
     * Requires that the icon was fetched beforehand
     * @see processIconForURL
     * @param {String} pageURL The page URL
     * @returns {Promise.<Buffer|null>} A promise that resolves with the buffered
     *  image data or null if there is no such icon
     */
    getIconForURL(pageURL) {
        return this.queue.channel("icon:store").enqueue(() => {
            return this.storageInterface
                .retrieveIcon(pageURL)
                .then(data => {
                    if (!data) {
                        return null;
                    }
                    return this.storageInterface.decodeIconFromStorage(data);
                });
        });
    }

    /**
     * Process the fetching of an icon for a Buttercup entry
     * @param {Entry} buttercupEntry The Buttercup entry instance
     * @returns {Promise.<Boolean>} A promise that resolves with boolean true if the icon was
     *  successfully processed or false if it was not
     */
    processIconForEntry(buttercupEntry) {
        const url = getEntryURL(buttercupEntry);
        return url ?
            this.processIconForURL(url) :
            Promise.resolve(false);
    }

    /**
     * Process the fetching of an icon for a page URL
     * @param {String} pageURL The page URL
     * @returns {Promise.<Boolean>} A promise that resolves with boolean true if an icon was
     *  successfully fetched or false if none was found
     * @fires Iconographer#iconAdded
     * @fires Iconographer#iconFetchFailed
     */
    processIconForURL(pageURL) {
        const downloadChannel = this.queue.channel("icon:download");
        const storeChannel = this.queue.channel("icon:store");
        return downloadChannel
            .enqueue(() => getIcon(pageURL))
            .then(iconResult => storeChannel.enqueue(() => {
                if (iconResult !== null) {
                    const { data } = iconResult;
                    return this.storageInterface.encodeIconForStorage(data)
                        .then(encodedData => this.storageInterface.storeIcon(pageURL, encodedData))
                        .then(() => {
                            /**
                             * Icon added event
                             * Fired with the associated page URL
                             * @event Iconographer#iconAdded
                             */
                            this.emitAsync("iconAdded", pageURL);
                            return true;
                        });
                }
                /**
                 * Icon fetch failure event
                 * Fired with the associated page URL
                 * @event Iconographer#iconFetchFailed
                 */
                this.emitAsync("iconFetchFailed", pageURL);
                return false;
            }));
    }

    /**
     * Remove an icon for a Buttercup entry
     * @param {Entry} buttercupEntry The Buttercup entry instance
     * @returns {Promise.<Boolean>} A promise that resolves with boolean true if the icon was removed
     * @see removeIconForURL
     */
    removeIconForEntry(buttercupEntry) {
        const url = getEntryURL(buttercupEntry);
        return url ?
            this.removeIconForURL(url) :
            Promise.resolve(false);
    }

    /**
     * Remove an icon for a URL
     * @param {String} pageURL The page URL where the icon was fetched
     * @returns {Promise.<Boolean>} A promise that resolves with boolean true if the icon was removed
     * @fires Iconographer#iconRemoved
     */
    removeIconForURL(pageURL) {
        return this.queue.channel("icon:store")
            .enqueue(() => this.storageInterface
                .deleteIcon(pageURL)
                .then(() => {
                    /**
                     * Icon removed event
                     * Fired with the associated page URL
                     * @event Iconographer#iconRemoved
                     */
                    this.emit("iconRemoved", pageURL);
                    return true;
                })
            );
    }

}

module.exports = Iconographer;
