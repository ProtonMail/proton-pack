# boilerplate
Boilerplate to start Proton React project

## Structure

```
* app
    * containers (one per page)
        * signup (contains containers, sections or dedicated components)
        * login
            * `LoginContainer.js`
        * accounts
        * summary
        * tokens
        * settings
            * account
            * wallets
            * security
            * notifications
            * advanced
        * transactions
    * components (mostly pure components)
        * layouts
        * header
        * sidebar
    * helpers
    * content (managing routes state: authenticated or not)
    * state (everything related to Redux to manage the store)
        * session
```

## webpack

`webpack.config.js` file need to be added per project.