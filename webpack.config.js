const { getSource, getPort } = require('./webpack/helpers/source');
const jsLoader = require('./webpack/js.loader');
const cssLoader = require('./webpack/css.loader');
const assetsLoader = require('./webpack/assets.loader');
const plugins = require('./webpack/plugins');
const optimization = require('./webpack/optimization');
const { outputPath } = require('./webpack/paths');

const { excludeNodeModulesExcept, excludeFiles, createRegex } = require('./webpack/helpers/regex');
const { BABEL_EXCLUDE_FILES, BABEL_INCLUDE_NODE_MODULES } = require('./webpack/constants');

const conf = {
    isProduction: process.env.NODE_ENV === 'production'
};

const { isProduction } = conf;

const config = {
    stats: 'minimal',
    mode: !isProduction ? 'development' : 'production',
    bail: isProduction,
    devtool: false,
    watchOptions: {
        ignored: [
            createRegex(excludeNodeModulesExcept(BABEL_INCLUDE_NODE_MODULES), excludeFiles(BABEL_EXCLUDE_FILES)),
            'i18n/*.json',
            /\*\.(gif|jpeg|jpg|ico|png)/
        ]
    },
    devServer: {
        hot: true,
        inline: true,
        compress: true,
        host: '0.0.0.0',
        public: 'localhost',
        historyApiFallback: true,
        disableHostCheck: true,
        contentBase: outputPath,
        stats: 'minimal'
    },
    resolve: {
        symlinks: false
    },
    entry: {
        index: [
            `webpack-dev-server/client?http://localhost:${getPort()}/`,
            'webpack/hot/dev-server',
            getSource('./src/app/index.js')
        ]
    },
    output: {
        path: outputPath,
        filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',
        chunkFilename: isProduction ? '[name].[chunkhash:8].chunk.js' : '[name].chunk.js',
        crossOriginLoading: 'anonymous'
    },
    module: {
        rules: [...jsLoader(conf), ...cssLoader(conf), ...assetsLoader(conf)]
    },
    plugins: plugins(conf),
    optimization: optimization(conf)
};

module.exports = config;
