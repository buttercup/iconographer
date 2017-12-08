"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require("eventemitter3");
var ChannelQueue = require("@buttercup/channel-queue");
var StorageInterface = require("./StorageInterface.js");
var MemoryStorageInterface = require("./MemoryStorageInterface.js");

var _require = require("./entry.js"),
    getEntryURL = _require.getEntryURL;

var _require2 = require("./fetching.js"),
    getIconOfPage = _require2.getIcon;

/**
 * Buttercup Entry
 * @typedef {Object} Entry
 * @property {Function} getMeta - Fetch meta from the entry
 */

/**
 * Iconographer class for processing icons and managing storage
 * @augments EventEmitter
 */


var Iconographer = function (_EventEmitter) {
    _inherits(Iconographer, _EventEmitter);

    function Iconographer() {
        _classCallCheck(this, Iconographer);

        var _this = _possibleConstructorReturn(this, (Iconographer.__proto__ || Object.getPrototypeOf(Iconographer)).call(this));

        _this._storageInterface = null;
        _this._queue = new ChannelQueue();
        return _this;
    }

    /**
     * The download channel, for queuing downloads
     * @type {Channel}
     */


    _createClass(Iconographer, [{
        key: "emitAsync",


        /**
         * Emit an event asynchronously
         * @param {String} key The event key
         * @param {...*} args The event arguments
         */
        value: function emitAsync(key) {
            var _this2 = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            setTimeout(function () {
                _this2.emit.apply(_this2, [key].concat(args));
            }, 0);
        }

        /**
         * Download icon data from a page
         * @param {String} pageURL The page URL
         * @returns {Promise.<BuffProcessedIconer|null>} A promise that resolves with either icon
         *  info, or null
         */

    }, {
        key: "fetchIconDataForPage",
        value: function fetchIconDataForPage(pageURL) {
            return getIconOfPage(pageURL);
        }

        /**
         * Get icon data for a buttercup entry
         * Requires that the icon was fetched beforehand
         * @see getIconForURL
         * @param {Entry} buttercupEntry The Buttercup entry instance
         * @returns {Promise.<Buffer|null>} A promise that resolves with the buffered
         *  image data or null if there is no such icon
         */

    }, {
        key: "getIconForEntry",
        value: function getIconForEntry(buttercupEntry) {
            var url = getEntryURL(buttercupEntry);
            return url ? this.getIconForURL(url) : Promise.resolve(null);
        }

        /**
         * Retrieve icon data for a specific page URL
         * Requires that the icon was fetched beforehand
         * @see processIconForURL
         * @param {String} pageURL The page URL
         * @returns {Promise.<Buffer|null>} A promise that resolves with the buffered
         *  image data or null if there is no such icon
         */

    }, {
        key: "getIconForURL",
        value: function getIconForURL(pageURL) {
            var _this3 = this;

            return this.queue.channel("icon:store").enqueue(function () {
                return _this3.storageInterface.retrieveIcon(pageURL).then(function (data) {
                    if (!data) {
                        return null;
                    }
                    return _this3.storageInterface.decodeIconFromStorage(data);
                });
            });
        }

        /**
         * Process the fetching of an icon for a Buttercup entry
         * @param {Entry} buttercupEntry The Buttercup entry instance
         * @returns {Promise.<Boolean>} A promise that resolves with boolean true if the icon was
         *  successfully processed or false if it was not
         */

    }, {
        key: "processIconForEntry",
        value: function processIconForEntry(buttercupEntry) {
            var url = getEntryURL(buttercupEntry);
            return url ? this.processIconForURL(url) : Promise.resolve(false);
        }

        /**
         * Process the fetching of an icon for a page URL
         * @param {String} pageURL The page URL
         * @returns {Promise.<Boolean>} A promise that resolves with boolean true if an icon was
         *  successfully fetched or false if none was found
         * @fires Iconographer#iconAdded
         * @fires Iconographer#iconFetchFailed
         */

    }, {
        key: "processIconForURL",
        value: function processIconForURL(pageURL) {
            var _this4 = this;

            // const downloadChannel = this.queue.channel("icon:download");
            // const storeChannel = this.queue.channel("icon:store");
            return this.downloadChannel.enqueue(function () {
                return _this4.fetchIconDataForPage(pageURL);
            }).then(function (iconResult) {
                return _this4.storeChannel.enqueue(function () {
                    if (iconResult !== null) {
                        var data = iconResult.data;

                        return _this4.storageInterface.encodeIconForStorage(data).then(function (encodedData) {
                            return _this4.storageInterface.storeIcon(pageURL, encodedData);
                        }).then(function () {
                            /**
                             * Icon added event
                             * Fired with the associated page URL
                             * @event Iconographer#iconAdded
                             */
                            _this4.emitAsync("iconAdded", pageURL);
                            return true;
                        });
                    }
                    /**
                     * Icon fetch failure event
                     * Fired with the associated page URL
                     * @event Iconographer#iconFetchFailed
                     */
                    _this4.emitAsync("iconFetchFailed", pageURL);
                    return false;
                });
            });
        }

        /**
         * Remove an icon for a Buttercup entry
         * @param {Entry} buttercupEntry The Buttercup entry instance
         * @returns {Promise.<Boolean>} A promise that resolves with boolean true if the icon was removed
         * @see removeIconForURL
         */

    }, {
        key: "removeIconForEntry",
        value: function removeIconForEntry(buttercupEntry) {
            var url = getEntryURL(buttercupEntry);
            return url ? this.removeIconForURL(url) : Promise.resolve(false);
        }

        /**
         * Remove an icon for a URL
         * @param {String} pageURL The page URL where the icon was fetched
         * @returns {Promise.<Boolean>} A promise that resolves with boolean true if the icon was removed
         * @fires Iconographer#iconRemoved
         */

    }, {
        key: "removeIconForURL",
        value: function removeIconForURL(pageURL) {
            var _this5 = this;

            return this.queue.channel("icon:store").enqueue(function () {
                return _this5.storageInterface.deleteIcon(pageURL).then(function () {
                    /**
                         * Icon removed event
                         * Fired with the associated page URL
                         * @event Iconographer#iconRemoved
                         */
                    _this5.emit("iconRemoved", pageURL);
                    return true;
                });
            });
        }
    }, {
        key: "downloadChannel",
        get: function get() {
            return this.queue.channel("icon:download");
        }

        /**
         * Get the channel queue instance
         * @type {ChannelQueue}
         */

    }, {
        key: "queue",
        get: function get() {
            return this._queue;
        }

        /**
         * Get the storage interface instance
         * @type {StorageInterface}
         */

    }, {
        key: "storageInterface",
        get: function get() {
            if (!this._storageInterface) {
                this._storageInterface = new MemoryStorageInterface();
            }
            return this._storageInterface;
        }

        /**
         * The store channel, for storing data
         * @type {Channel}
         */
        ,
        set: function set(si) {
            if (si instanceof StorageInterface !== true) {
                throw new Error("Unable to set storage interface: provided object not an instance of StorageInterface");
            }
            this._storageInterface = si;
        }
    }, {
        key: "storeChannel",
        get: function get() {
            return this.queue.channel("icon:store");
        }
    }]);

    return Iconographer;
}(EventEmitter);

module.exports = Iconographer;