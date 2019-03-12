const path = require('path');

const CONFIG = require('../webpack.config');

const loadUserConfig = () => {
    try {
        const fromUser = require(path.join(process.cwd(), 'proton.config.js'));
        if (typeof fromUser !== 'function') {
            const msg = [
                '[ProtonPack] Error',
                'The custom config from proton.config.js must export a function.',
                'This function takes one argument which is the webpack config.',
                ''
            ].join('\n');
            console.error(msg);
            process.exit(1);
        }
        return fromUser(CONFIG);
    } catch (e) {
        return CONFIG;
    }
};

module.exports = loadUserConfig(CONFIG);
