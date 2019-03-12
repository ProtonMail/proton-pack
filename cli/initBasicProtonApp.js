const fs = require('fs').promises;
const util = require('util');
const execa = require('execa');
const dedent = require('dedent');

const writeFile = util.promisify(fs.writeFile);
const bash = (cli) => execa.shell(cli, { shell: '/bin/bash' });

const TEMPLATE_INDEX = dedent`
    import boilerplate from 'proton-pack';
    import './app.scss';

    boilerplate(() => {
        return import('./init');
    });
`;

const TEMPLATE_INIT = dedent`
    import ReactDOM from 'react-dom';
    import React from 'react';
    import { setConfig } from 'react-hot-loader';

    import createApp from './App';

    setConfig({
        ignoreSFC: true, // RHL will be __completely__ disabled for SFC
        pureRender: true // RHL will not change render method
    });

    export default () => {
        const App = createApp();
        ReactDOM.render(<App />, document.querySelector('.app-root'));
    };

`;

const TEMPLATE_APPHTML = dedent`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no">
        <meta http-equiv="x-dns-prefetch-control" content="off">
        <base href="/">
        <title></title>
        <meta name="description" content="Log in or create an account.">
        <link rel="shortcut icon" href="/assets/favicons/favicon.ico">
        <meta name="google" content="notranslate">
    </head>
    <body>
        <div class="app-root"></div>
        <div class="modal-root"></div>
        <noscript class="pm_noscript">
            ProtonMail requires Javascript. Enable Javascript and reload this page to continue.
        </noscript>
    </body>
    </html>
`;

const TEMPLATE_APP = dedent`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no">
        <meta http-equiv="x-dns-prefetch-control" content="off">
        <base href="/">
        <title></title>
        <meta name="description" content="Log in or create an account.">
        <link rel="shortcut icon" href="/assets/favicons/favicon.ico">
        <meta name="google" content="notranslate">
    </head>
    <body>
        <div class="app-root"></div>
        <div class="modal-root"></div>
        <noscript class="pm_noscript">
            ProtonMail requires Javascript. Enable Javascript and reload this page to continue.
        </noscript>
    </body>
    </html>
`;

async function main() {
    await bash('mkdir -p src2/app');

    const files = [
        {
            file: 'src2/app/index.js',
            template: TEMPLATE_INDEX
        },
        {
            file: 'src2/app/init.js',
            template: TEMPLATE_INIT
        },
        {
            file: 'src2/app.ejs',
            template: TEMPLATE_APPHTML
        }
    ].map(({ file, template }) => fs.writeFile(file, template));

    await Promise.all(files);
    console.log('DONE');
}

module.exports = main;
