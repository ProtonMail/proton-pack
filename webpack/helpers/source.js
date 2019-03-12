const path = require("path");
const ROOT_DIR = process.cwd();

const getPort = () => process.env.NODE_ENV_PORT || 8080;
const getSource = (input) => path.join(ROOT_DIR, input);


module.exports = {
    getPort,
    getSource
};
