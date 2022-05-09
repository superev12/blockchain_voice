const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
    {
        mode: "development",
        entry: {
            main: path.resolve(__dirname, "../src/view/view.ts"),
        },
        output: {
            path: path.resolve(__dirname, "../dist"),
            filename: "view.bundle.js",
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-typescript"]
                        },
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "View",
                filename: "index.html",
                template: path.resolve(__dirname, "../src/index.html"),
            }),
        ],
        resolve: {
            fallback: {
                path: require.resolve("path-browserify"),
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/")
            }
        },
    },
    {
        mode: "development",
        entry: {
            main: path.resolve(__dirname, "../src/submit/submit.ts"),
        },
        output: {
            path: path.resolve(__dirname, "../dist"),
            filename: "submit.bundle.js",
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-typescript"]
                        },
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Submit",
                filename: "submit.html",
                template: path.resolve(__dirname, "../src/submit.html"),
            }),
        ],
        resolve: {
            fallback: {
                path: require.resolve("path-browserify"),
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/")
            }
        },
    },
];
