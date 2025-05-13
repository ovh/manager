# ng-ovh-user-pref

> An AngularJS service to create/get/delete user preferences.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-user-pref)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-user-pref) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-user-pref)](https://npmjs.com/package/@ovh-ux/ng-ovh-user-pref) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-user-pref)](https://npmjs.com/package/@ovh-ux/ng-ovh-user-pref?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-user-pref)](https://npmjs.com/package/@ovh-ux/ng-ovh-user-pref?activeTab=dependencies)

## Install

```sh
$ yarn add @ovh-ux/ng-ovh-user-pref
```

## Usage

```js
import angular from 'angular';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';

angular.module('myApp', [ngOvhUserPref]);
```

- Create an user preference on api.ovh.com.
- Merge an existing user preference on api.ovh.com.
- Get all keys of user preference for one user.
- Get user preference for a specific key.
- Delete an user preference for a specific key.

Format:
- The format of a key must be in uppercase, words separated by underscores `_`.
- Key name sample: (`COMMON_LANG`, `WEB_DOMAIN_FAVORITES`, `DEDICATED_DASHBOARD`, ...).

## Test

```sh
$ yarn test
```

## Related

- [ovh-api-services](https://github.com/ovh-ux/ovh-api-services) - Contains all AngularJS $resource for OVHcloud API

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
