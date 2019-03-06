import '@babel/polyfill';
import 'yetch/polyfill';

import { hasModulesSupport } from 'proton-shared/lib/helpers/browser';
import { initMain, initWorker } from 'proton-shared/lib/helpers/setupPmcrypto';
import { check, redirect } from 'proton-shared/lib/helpers/compat';

import './app.scss';

// eslint-disable-next-line no-undef
const { main, compat, worker } = PM_OPENPGP;

const dl = ({ filepath, integrity }) => {
    const options = {
        integrity,
        credentials: 'include'
    };
    return fetch(filepath, options).then((response) => response.text());
};

(async () => {
    if (!check()) {
        return redirect();
    }

    // pre-fetch everything
    const initPromise = import('./init');
    const openpgpPromise = dl(hasModulesSupport() ? main : compat);
    const workerPromise = dl(worker);

    const openpgpContents = await openpgpPromise;
    // wait for the app to be fetched and openpgp main file to be initialized
    const [app] = await Promise.all([initPromise, initMain(openpgpContents)]);

    // bootstrap the app
    app.default();

    // lazily create the workers
    await initWorker(openpgpContents, await workerPromise);
})();
