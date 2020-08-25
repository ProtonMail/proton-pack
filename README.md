# Proton Pack

Create your application with openpgp and our webpack config.

## How to install ?

```sh
$ npm i -D github:ProtonMail/proton-pack.git#semver:^1.0.0
```

## Create a new app with openpgp etc.

1. `$ npx proton-pack init` _If you want to use our boilerplate_
2. `$ npm start` :popcorn: App available on :8080

### Dev env

As for the WebClient you need to have `appConfig.json` (_previously_ `env.json`)<br>
A new key exists inside this file now, to add more config
```jsonc
{
    "appConfig": {
        "clientId": "WebMail", // use to identify the application by the API
        "appName": "protonmail", // use to identify the application by the proton react components
        "urlI18n": "", // [mandatory if not protonmail] Url for i18n, ex: settings for protonmail-settings
        "clientType": "", // Custom client type
        "version": "", // Custom version
    }
}
```
## Commands

- `$ proton-pack help`

- `$ proton-pack init <type>`
- type: default (default) basic app
- type: auth basic app with login + private routes

> _Create a basic app from our boilerplate with openpgp_

- `$ proton-pack extract-i18n`

> _Extract translations for the app_

- `$ proton-pack compile`
- `$ proton-pack dev-server`

> _Run a dev server available on `8080` by default. You can customize the port via_ `NODE_ENV_PORT`

You can also pass custom flags:
- `--port=<Number>`: to use a custom port
- `--publicPath=/settings/`: to serve the app on /settings/
- `--api=<key>|<url>`: key one of the ones from the appConfig (ex: .dev.api -> key= dev) or URL ex: https://mail.protonmail.com/api

- `$ proton-pack compile`

> _Build your app_


- `$ proton-pack print-config`

> _Print as JSON the current config_

## How to configure

Create a file `proton.config.js` at the root of your app.

- It takes and object as argument `webpackConfig`
- It must return the config

**It's a standard webpack config, nothing custom. It contains our config.**

Ex: _to have a verbose dev server_
```js
module.exports = (webpackConfig) => {
    webpackConfig.devServer.stats = 'normal';
    return webpackConfig;
}
```

