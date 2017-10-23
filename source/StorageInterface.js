class StorageInterface {

    decodeIconFromStorage(data) {
        return Promise.resolve(data);
    }

    deleteIcon(iconKey) {
        throw new Error(`Cannot delete icon: deleteIcon not implemented`);
    }

    encodeIconForStorage(data) {
        return Promise.resolve(data);
    }

    getIconKeys() {
        throw new Error(`Cannot get icon keys: getIconKeys not implemented`);
    }

    retrieveIcon(iconKey) {
        throw new Error(`Cannot retrieve icon: retrieveIcon not implemented`);
    }

    storeIcon(iconKey, iconData) {
        throw new Error(`Cannot store icon: storeIcon not implemented`);
    }

}

module.exports = StorageInterface;
