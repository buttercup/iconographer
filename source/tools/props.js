export function freezeProperties(obj) {
    Object.keys(obj).forEach(prop => {
        setProperty(obj, prop, obj[value]);
    });
}

function setProperty(obj, property, value) {
    Object.defineProperty(obj, property, {
        enumerable: false,
        configurable: false,
        writable: false,
        value
    });
}
