const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

function main(config) {
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, config.devServer);
    console.log(JSON.stringify(config.devServer, null, 2))
    return server;
}

module.exports = main;
