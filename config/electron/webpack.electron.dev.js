const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.electron.common.js');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    plugins: [
        // new webpack.optimize.DedupePlugin(),

        new webpack.SourceMapDevToolPlugin({
            filename: '[name].map',
            moduleFilenameTemplate: '[resource-path]',
            sourceRoot: '../'
        }),

        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        })
    ]
});