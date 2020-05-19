const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const outputPath = resolveApp('dist');
const appSrcPath = resolveApp('src');
const appNodeModulesPath = resolveApp('node_modules');
const appTsConfigPath = resolveApp('tsconfig.json');

module.exports = {
    appSrcPath,
    appNodeModulesPath,
    appTsConfigPath,
    outputPath
};
