const icoJS = require("icojs");
const svgToPng = require("svg2png");
const gifFrames = require("gif-frames");
const streamToBuffer = require("stream-to-buffer");
const Jimp = require("jimp");
const imageSize = require("image-size");
const arrayBufferToBuffer = require("arraybuffer-to-buffer");

const SIZE = 256;

function convertFetchedIconToPNG(fetchedIconInfo) {
    const { data, ext } = fetchedIconInfo;
    if (ext === "ico") {
        return convertICOToPNG(data)
            .then(({ data, size }) =>
                Object.assign({}, fetchedIconInfo, {
                    data,
                    size,
                    ext: "png",
                    mime: "image/png"
                })
            )
            .then(fetchedIcon => convertFetchedIconToPNG(fetchedIcon));
    } else if (ext === "svg") {
        const svgData = data.toString("utf8");
        return svgToPng(svgData, { width: SIZE, height: SIZE })
            .then(buff =>
                Object.assign({}, fetchedIconInfo, {
                    data: buff,
                    size: SIZE,
                    ext: "png",
                    mime: "image/png"
                })
            )
            .then(fetchedIcon => convertFetchedIconToPNG(fetchedIcon));
    } else if (ext === "gif") {
        return gifFrames({ url: data, frames: 1, outputType: "png" })
            .then(frameData => frameData.getImage())
            .then(dataStream => new Promise((resolve, reject) => {
                streamToBuffer(dataStream, (err, buff) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(buff);
                });
            }))
            .then(buff => Object.assign({}, fetchedIconInfo, {
                data: buff,
                ext: "png",
                mime: "image/png"
            }))
            .then(fetchedIcon => convertFetchedIconToPNG(fetchedIcon));
    }
    const { width, height } = imageSize(data);
    let originalSize = fetchedIconInfo.size > 0 ? fetchedIconInfo.size : width;
    const newOutput = Object.assign({}, fetchedIconInfo, {
        size: SIZE,
        originalSize,
        originalData: data,
        ext: "png",
        mime: "image/png",
        square: width === height
    })
    return Jimp
        .read(data)
        .then(jimp => {
            jimp.resize(SIZE, SIZE);
            return jimp.getBufferAsync(Jimp.MIME_PNG);
        })
        .then(buff => {
            newOutput.data = buff;
            return Jimp.read(data);
        })
        .then(jimp => {
            jimp
                .greyscale()
                .resize(SIZE, SIZE);
            return jimp.getBufferAsync(Jimp.MIME_PNG);
        })
        .then(buff => {
            newOutput.dataGrey = buff;
            return newOutput;
        });
}

function convertICOToPNG(buff) {
    return icoJS
        .parse(buff, "image/png")
        .then(selectLargestIco)
        .then(img => ({
            data: arrayBufferToBuffer(img.buffer),
            size: img.width
        }));
}

function selectLargestIco(images) {
    const convertedImages = [...images];
    convertedImages.sort((imageA, imageB) => {
        if (imageA.width > imageB.width) {
            return -1;
        } else if (imageB.width > imageA.width) {
            return 1;
        }
        return 0;
    });
    return convertedImages[0];
}

module.exports = {
    convertFetchedIconToPNG,
    convertICOToPNG
};
