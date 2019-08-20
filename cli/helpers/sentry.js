const { sync } = require('./helpers/cli');

const getBuildCommit = () => {
    try {
        const origin = sync('git rev-parse HEAD');
        return origin.toString().trim();
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
    if (api === 'blue') {
        return {};
    }

    const env = ['dev', 'red'].includes(api) ? 'dev' : api;
    const { sentry: SENTRY_DSN = '' } = sentry[env] || {};

    // For production the release is the version else the hash from the build
    const SENTRY_RELEASE = env === 'prod' ? version : getBuildCommit();

    return { SENTRY_DSN, SENTRY_RELEASE };
}

module.exports = getSentryConfig;
