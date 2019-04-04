const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

function main(config) {
    const compiler = webpack(config);

    new ProgressBarPlugin({
        format: '  build [:bar] :percent (:elapsed seconds)',
        clear: false,
        width: 60
    }).apply(compiler);

    compiler.run(function(err, stats) {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        console.log(
            stats.toString({
                chunks: false,
                colors: true
            })
        );
    });

    return compiler;
}

module.exports = main;
