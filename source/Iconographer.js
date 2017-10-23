const EventEmitter = require("eventemitter3");
const ChannelQueue = require("@buttercup/channel-queue");
const StorageInterface = require("./StorageInterface.js");
const MemoryStorageInterface = require("./MemoryStorageInterface.js");
const { getEntryURL } = require("./entry.js");
const { getIcon } = require("./fetching.js");

class Iconographer extends EventEmitter {

    constructor() {
        super();
        this._storageInterface = null;
        this._queue = new ChannelQueue();
    }

    get queue() {
        return this._queue;
    }

    get storageInterface() {
        const si = this._storageInterface;
        if (!si) {
            si = new MemoryStorageInterface();
        }
        return si;
    }

    set storageInterface(si) {
        if (si instanceof StorageInterface !== true) {
            throw new Error("Unable to set storage interface: provided object not an instance of StorageInterface");
        }
        this._storageInterface = si;
    }

    emitAsync(key, ...args) {
        setTimeout(() => {
            this.emit(key, ...args);
        }, 0);
    }

    getIconForEntry(buttercupEntry) {
        const url = getEntryURL(buttercupEntry);
        return url ?
            this.getIconForURL(url) :
            Promise.resolve(null);
    }

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

    processIconForEntry(buttercupEntry) {
        const url = getEntryURL(buttercupEntry);
        return url ?
            this.processIconForURL(url) :
            Promise.resolve(false);
    }

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
                            this.emitAsync("iconAdded", pageURL);
                            return true;
                        });
                }
                this.emitAsync("iconFetchFailed", pageURL);
                return false;
            }));
    }

    removeIconForEntry(buttercupEntry) {
        const url = getEntryURL(buttercupEntry);
        return url ?
            this.removeIconForURL(url) :
            Promise.resolve(false);
    }

    removeIconForURL(pageURL) {
        return this.queue.channel("icon:store")
            .enqueue(() => this.storageInterface
                .deleteIcon(pageURL)
                .then(() => {
                    this.emit("iconRemoved", pageURL);
                    return true;
                })
            );
    }

}

module.exports = Iconographer;
