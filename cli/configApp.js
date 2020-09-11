const path = require('path');
const dedent = require('dedent');
const argv = require('minimist')(process.argv.slice(2));

const { sync } = require('./helper/cli');
const { warn, error } = require('./helpers/log');
const prepareSentry = require('./helpers/sentry');

const isSilent = argv._.includes('help') || argv._.includes('init') || argv._.includes('print-config');

const readJSON = (file) => {
    const fileName = `${file}.json`;

    if (file === 'env' && !isSilent) {
        warn('[DEPREACTION NOTICE] Please rename your file env.json to appConfig.json');
    }

    try {
        return require(path.join(process.cwd(), fileName));
    } catch (e) {
        !isSilent && warn(`Missing file ${fileName}`);
        if (/SyntaxError/.test(e.stack)) {
            error(e);
        }
    }
};

/**
 * Get the hash of the current commit we build against
 * @return {String} fill hash of the commit
 */
const getBuildCommit = () => {
    try {
        const { stdout = '' } = sync('git rev-parse HEAD');
        return stdout.trim();
    } catch (e) {
        return '';
    }
};

/**
 * Extract the config of a project
 * - env: from env.json for sentry, and some custom config for the app
 *     appConfig: {
 *         name: 'Web',
 *         etc.
 *     }
 * - pkg: from package.json for sentry
 * @return {Object}   { env: Object, pkg: Object }
 */
const CONFIG_ENV = (() => {
    const pkg = require(path.join(process.cwd(), 'package.json'));
    // @todo load value from the env as it's done for proton-i19n
    return {
        env: readJSON('appConfig') || readJSON('env') || {},
        pkg
    };
})();

/**
 * Read the configuration for translations, it's a file generated by the CI
 * <locale>: <name of the locale>
 */
const LOCALES = (() => {
    try {
        return require(path.join(process.cwd(), 'node_modules', 'proton-translations', 'config', 'locales.json'));
    } catch (e) {
        if (!process.argv.includes('print-config')) {
            warn('No po/locales.json available yet');
        }
        return {};
    }
})();

const ENV_CONFIG = Object.keys(CONFIG_ENV.env).reduce(
    (acc, key) => {
        if (key === 'appConfig') {
            acc.app = CONFIG_ENV.env[key];
            return acc;
        }
        const { api, secure } = CONFIG_ENV.env[key];
        api && (acc.api[key] = api);
        secure && (acc.secure[key] = secure);
        return acc;
    },
    { sentry: {}, api: {}, secure: {}, pkg: CONFIG_ENV.pkg, app: {} }
);

ENV_CONFIG.sentry = Object.entries(CONFIG_ENV.env).reduce((acc, [env, { sentry }]) => {
    if (sentry && env !== 'proxy') {
        acc[env] = sentry;
    }
    return acc;
}, Object.create(null));

const API_TARGETS = {
    prod: 'https://mail.protonmail.com/api',
    local: 'https://protonmail.dev/api',
    localhost: 'https://localhost/api',
    build: '/api',
    ...ENV_CONFIG.api
};

/**
 * Yargs creates an array if you gives many flags
 * Ensure to take only the last one
 * @param  {String|Array} api
 * @return {Object}
 */
const getApi = (api) => {
    const parse = (api) => {
        if (!Array.isArray(api)) {
            return api || 'proxy';
        }

        const { length, [length - 1]: latest } = api.filter(Boolean);
        return latest || 'proxy';
    };

    const value = parse(api);

    // We can do --api=https://mail.protonmail.com/api and it's only for dev, so we can stop here
    if (value.includes('/api')) {
        return { value, url: value };
    }

    // Because we can "extend" via + -> --api dev+proxy = dev env but with /api as API url
    const urlList = value.split('+');
    const url = urlList.reduce((apiUrl, apiKey) => API_TARGETS[apiKey] || apiUrl, API_TARGETS.prod);

    return { value, url, first: urlList[0] };
};

function main({ api = 'dev' }) {
    const { url: apiUrl, first: firstApi } = getApi(api);
    const json = {
        clientId: ENV_CONFIG.app.clientId || 'WebMail',
        appName: ENV_CONFIG.app.appName || ENV_CONFIG.pkg.name || 'protonmail',
        version: ENV_CONFIG.app.version || ENV_CONFIG.pkg.version || '3.16.20',
        locales: LOCALES,
        apiUrl
    };

    const COMMIT_RELEASE = getBuildCommit();

    // When we give to --api an url it means -> dev mode so osef of sentry
    const SENTRY_DSN = firstApi ? prepareSentry(ENV_CONFIG, firstApi) : '';

    json.sentry = {
        release: firstApi ? COMMIT_RELEASE : '',
        dsn: SENTRY_DSN
    };

    const config = dedent`
    export const CLIENT_ID = '${json.clientId}';
    export const CLIENT_TYPE = ${ENV_CONFIG.app.clientType || 1};
    export const CLIENT_SECRET = '${ENV_CONFIG.app.clientSecret || ''}';
    export const APP_VERSION = '${json.version}';
    export const APP_NAME = '${json.appName}';
    export const API_URL = '${apiUrl}';
    export const LOCALES = ${JSON.stringify(LOCALES)};
    export const API_VERSION = '3';
    export const DATE_VERSION = '${new Date().toGMTString()}';
    export const CHANGELOG_PATH = 'assets/changelog.tpl.html';
    export const VERSION_PATH = 'assets/version.json';
    export const COMMIT_RELEASE = '${COMMIT_RELEASE}';
    export const SENTRY_DSN = '${SENTRY_DSN}';
    `;

    return {
        config,
        apiUrl,
        json,
        path: path.join(process.cwd(), 'src', 'app', 'config.ts')
    };
}

module.exports = main;
