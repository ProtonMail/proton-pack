const { sync } = require('./cli');

const getBuildCommit = (api) => {
    try {
        const { stdout = '' } = sync('git rev-parse HEAD');
        return `${api}_${stdout.trim()}`;
    } catch (e) {
        return '';
    }
};

/**
 * Get correct sentry UR/releaseL config for the current env
 * release can be undefined if we don't have a release available
 * - on dev it's based on the API you specify
 * - on deploy it's based on the branch name
 * @return {Object}
 */
function getSentryConfig({ sentry = {} }, { version }, api) {
    if (api === 'blue' || (process.env.NODE_ENV !== 'production' && api !== 'proxy')) {
        return {};
    }

    const env = ['dev', 'red'].includes(api) ? 'dev' : api;

    // For production the release is the version else the hash from the build
    const SENTRY_RELEASE = env === 'prod' ? version : getBuildCommit(api);

    return { SENTRY_DSN: sentry, SENTRY_RELEASE, SENTRY_DSN_ENV: env };
}

module.exports = getSentryConfig;
