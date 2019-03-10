const path = require("path");
const { DefinePlugin } = require("webpack");

module.exports = {
    entry: path.resolve(__dirname, "./source/index.js"),

    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "images/[name].[ext]"
                    }
                }
            }
        ]
    },

    node: {
        fs: "empty"
    },

    output: {
        filename: "iconographer.js",
        path: path.resolve(__dirname, "./dist")
    },

    plugins: [
        new DefinePlugin({
            WP_ENV: true
        })
    ]
};
