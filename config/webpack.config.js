const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, '../src/main.js'),
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'View',
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/index.html'),
        }),
        new HtmlWebpackPlugin({
            title: 'Submit',
            filename: 'submit.html',
            template: path.resolve(__dirname, '../src/submit.html'),
        }),
    ],
    resolve: {
        fallback: {
            path: require.resolve("path-browserify")
        }
    },
};
