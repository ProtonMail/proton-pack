const path = require('path');
const ROOT_DIR = process.cwd();
const portfinder = require('portfinder'); // Coming from webpack-dev-server

const getPort = () => process.env.NODE_ENV_PORT || 8080;
const findPort = async () => {
    // Default PORT for webpack
    portfinder.basePort = getPort();
    const port = await portfinder.getPortPromise();
    process.env.NODE_ENV_PORT = port;
    return port;
};

const getSource = (input) => path.join(ROOT_DIR, input);

module.exports = {
    getPort,
    findPort,
    getSource
};
