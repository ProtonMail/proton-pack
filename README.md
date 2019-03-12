# Proton Pack

Create your application with openpgp and our webpack config.

## Dev

1. `$ npm i`
2. `$ npm start`
3. :popcorn: App available on :8080

## Commands

- `$ proton-pack dev-server`

> _Run a dev server available on `8080` by default. You can customize the port via_ `NODE_ENV_PORT`

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

## How to setup my app ?

```js
import boilerplate from 'proton-pack';
import './app.scss';

boilerplate(() => {
    return import('./init');
});
```
And you're done. With this you will auto load OpenPGP, your app and the worker. PmCrypto is ready.
