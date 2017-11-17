const helpers = require('./../helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'main': './src/main.ts'
    },

    target: 'electron',

    node: {
        __dirname: false
    },

    output: {
        path: helpers.root('./app/dist'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [{
            test: /\.ts$/,
            loaders: 'awesome-typescript-loader'
        }]
    },


};