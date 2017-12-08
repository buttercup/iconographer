"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Storage interface for storing icons
 */
var StorageInterface = function () {
  function StorageInterface() {
    _classCallCheck(this, StorageInterface);
  }

  _createClass(StorageInterface, [{
    key: "decodeIconFromStorage",

    /**
     * Decode icon data that was pulled from storage
     * @param {*} data The encoded data as it was stored
     * @returns {Promise.<Buffer>} A promise that resolves with a buffer
     */
    value: function decodeIconFromStorage(data) {
      return Promise.resolve(data);
    }

    /**
     * Delete an icon in storage
     * @param {String} iconKey The icon key
     * @returns {Promise} A promise that resolves once deletion has completed
     */

  }, {
    key: "deleteIcon",
    value: function deleteIcon(iconKey) {
      throw new Error("Cannot delete icon: deleteIcon not implemented");
    }

    /**
     * Encode icon data for storage
     * @param {Buffer} data The data buffer for encoding
     * @returns {Promise.<*>} A promise that resolves with the encoded data ready
     *  for storage
     */

  }, {
    key: "encodeIconForStorage",
    value: function encodeIconForStorage(data) {
      return Promise.resolve(data);
    }

    /**
     * Fetch all icon keys
     * @returns {Promise.<Array.<String>>} A promise that resolves with an array of icon keys
     */

  }, {
    key: "getIconKeys",
    value: function getIconKeys() {
      throw new Error("Cannot get icon keys: getIconKeys not implemented");
    }

    /**
     * Retrieve the raw data for an icon
     * @param {String} iconKey The icon key
     * @returns {Promise.<*>} A promise that resolves with raw icon data
     */

  }, {
    key: "retrieveIcon",
    value: function retrieveIcon(iconKey) {
      throw new Error("Cannot retrieve icon: retrieveIcon not implemented");
    }

    /**
     * Store encoded icon data
     * @param {String} iconKey The icon key
     * @param {*} iconData The encoded icon data
     * @returns {Promise} A promise that resolves once storage has been completed
     */

  }, {
    key: "storeIcon",
    value: function storeIcon(iconKey, iconData) {
      throw new Error("Cannot store icon: storeIcon not implemented");
    }
  }]);

  return StorageInterface;
}();

module.exports = StorageInterface;