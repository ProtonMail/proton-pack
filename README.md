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

As for the WebClient you need to have `env.json`
A new key exists inside this file now, to add more config
```json
{
    "appConfig": {
        "clientId": "Web"
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

- `$ proton-pack compile`

> _Build your app_

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

## How to setup my app ? (manually)

```js
import boilerplate from 'proton-pack'; // Will auto wrap your app with openpgp etc.
import './app.scss'; // Custom CSS for your project

boilerplate(() => {
    return import('./init'); // There goes your app
});
```
And you're done. With this you will auto load OpenPGP, your app and the worker. pmCrypto is ready.
