const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.electron.common.js');
const JavaScriptObfuscator = require('webpack-obfuscator');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    plugins: [
        new JavaScriptObfuscator({
            compact: true,
            sourceMap: false
        }),

        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        })
    ]
});