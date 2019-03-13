const path = require('path');
const fs = require('fs').promises;
const execa = require('execa');
const chalk = require('chalk');
const dedent = require('dedent');

const bash = (cli) => execa.shell(cli, { shell: '/bin/bash' });

const TEMPLATE = path.resolve(__dirname, '..', 'template');
const PATH_APP_PKG = path.join(process.cwd(), 'package.json');

/**
 * Copy the template boilerplate into the root ap
 */
async function main() {
    await bash(`cp -r ${TEMPLATE}/src src`);
    await bash(`cp -r ${TEMPLATE}/.{editorconfig,eslintrc.json,prettierrc,gitignore} .`);

    const pkgTpl = require('../template/package.json');
    const pkgApp = require(PATH_APP_PKG);

    const pkg = {
        ...pkgApp,
        ...pkgTpl,
        devDependencies: {
            ...pkgApp.devDependencies,
            ...pkgTpl.devDependencies
        }
    };

    await fs.writeFile(PATH_APP_PKG, JSON.stringify(pkg, null, 4));

    console.log(dedent`
        🎉 ${chalk.green('Your app is ready')}

        Here is what's available for this setup:
            - EditorConfig
            - Eslint
            - Prettier
            - Husky + lint-staged
            - React
            - npm scripts
                - ${chalk.yellow('start')}: dev server
                - Hook postversion for pushing git tag

        ➙ Now you can run ${chalk.yellow('npm start')}
    `);
}

module.exports = main;
