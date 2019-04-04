const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { success, error } = require('./log');

function main(config) {
    const compiler = webpack(config);

    new ProgressBarPlugin({
        format: '  build [:bar] :percent (:elapsed seconds)',
        clear: false,
        width: 60
    }).apply(compiler);

    compiler.run(function(err, stats) {
        if (err) {
            const errorString = (err.stack || err.toString()) + err.details || '';
            error(errorString);
        }

        success(
            stats.toString({
                chunks: false,
                colors: true
            })
        );
    });

    return compiler;
}

module.exports = main;
