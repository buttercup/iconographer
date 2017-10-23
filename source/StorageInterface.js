/**
 * Storage interface for storing icons
 */
class StorageInterface {

    /**
     * Decode icon data that was pulled from storage
     * @param {*} data The encoded data as it was stored
     * @returns {Promise.<Buffer>} A promise that resolves with a buffer
     */
    decodeIconFromStorage(data) {
        return Promise.resolve(data);
    }

    /**
     * Delete an icon in storage
     * @param {String} iconKey The icon key
     * @returns {Promise} A promise that resolves once deletion has completed
     */
    deleteIcon(iconKey) {
        throw new Error(`Cannot delete icon: deleteIcon not implemented`);
    }

    /**
     * Encode icon data for storage
     * @param {Buffer} data The data buffer for encoding
     * @returns {Promise.<*>} A promise that resolves with the encoded data ready
     *  for storage
     */
    encodeIconForStorage(data) {
        return Promise.resolve(data);
    }

    /**
     * Fetch all icon keys
     * @returns {Promise.<Array.<String>>} A promise that resolves with an array of icon keys
     */
    getIconKeys() {
        throw new Error(`Cannot get icon keys: getIconKeys not implemented`);
    }

    /**
     * Retrieve the raw data for an icon
     * @param {String} iconKey The icon key
     * @returns {Promise.<*>} A promise that resolves with raw icon data
     */
    retrieveIcon(iconKey) {
        throw new Error(`Cannot retrieve icon: retrieveIcon not implemented`);
    }

    /**
     * Store encoded icon data
     * @param {String} iconKey The icon key
     * @param {*} iconData The encoded icon data
     * @returns {Promise} A promise that resolves once storage has been completed
     */
    storeIcon(iconKey, iconData) {
        throw new Error(`Cannot store icon: storeIcon not implemented`);
    }

}

module.exports = StorageInterface;
