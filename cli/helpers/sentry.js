const { sync } = require('./cli');

const getBuildCommit = () => {
    try {
        const { stdout = '' } = sync('git rev-parse HEAD');
        return stdout.trim();
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
function getSentryConfig({ sentry = {} }, api) {
    if (api === 'blue' || (process.env.NODE_ENV !== 'production' && api !== 'proxy')) {
        return {};
    }
    return { SENTRY_DSN: sentry, SENTRY_RELEASE: getBuildCommit() };
}

module.exports = getSentryConfig;
