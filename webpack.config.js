const path = require("path");
const { DefinePlugin } = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const WEB = path.resolve(__dirname, "./web");

module.exports = {
    entry: path.resolve(__dirname, "./source/index.js"),

    node: {
        fs: "empty"
    },

    output: {
        filename: "iconographer.js",
        path: WEB,
        libraryTarget: "commonjs2"
    },

    plugins: [
        new DefinePlugin({
            WP_ENV: true
        }),
        new CopyPlugin([
            { from: "resources/images/*", to: path.join(WEB, "images"), flatten: true }
        ])
    ]
};
