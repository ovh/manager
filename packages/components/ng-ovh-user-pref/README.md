# OVH Angular user pref

> An angular service to create/get/delete user preferences

  -     Create an user preference on api.ovh.com
  -     Merge an existing user preference on api.ovh.com
  -     Get all keys of user preference for one user
  -     Get user preference for a specific key
  -     Delete an user preference for a specific key

## Install

```sh
yarn add @ovh-ux/ng-ovh-user-pref
```

## Usage

```js
import angular from 'angular';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';

angular
  .module('myApp', [
    ngOvhUserPref,
  ]);
```

+ Format :
    -   The format of a key must be in uppercase, words separated by underscores `_`
    -   Key name sample : (`COMMON_LANG`, `WEB_DOMAIN_FAVORITES`, `DEDICATED_DASHBOARD`, ...)

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-user-pref/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-user-pref/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
