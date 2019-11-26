const path = require('path');

const transformFile = require('./files');

const getDefineObject = (publicPath, { filepath, integrity }) => {
    return {
        filepath: path.join(publicPath, filepath),
        integrity
    };
};

const transformWorkerContents = (path, contents) =>
    contents.replace('self.window=self,importScripts("openpgp.min.js");', '');

const transformCompatPath = ({ basename, ext, hash }) => [basename, 'compat', hash, ext].join('.');

const transform = (openpgpPaths, openpgpWorkerPath, publicPath, isDistRelease) => {
    const main = transformFile({
        filepath: path.resolve(openpgpPaths[0]),
        hash: isDistRelease
    });

    const elliptic = transformFile({
        filepath: path.resolve(openpgpPaths[1]),
        hash: isDistRelease
    });

    const compat = transformFile({
        filepath: path.resolve(openpgpPaths[2]),
        hash: isDistRelease,
        transformPath: transformCompatPath
    });

    const worker = transformFile({
        filepath: path.resolve(openpgpWorkerPath),
        hash: isDistRelease,
        transformContents: transformWorkerContents
    });

    const getDefinition = () => {
        return {
            main: getDefineObject(publicPath, main),
            compat: getDefineObject(publicPath, compat),
            elliptic: getDefineObject(publicPath, elliptic),
            worker: getDefineObject(publicPath, worker)
        };
    };

    return {
        main,
        worker,
        compat,
        elliptic,
        definition: getDefinition()
    };
};

module.exports = transform;
