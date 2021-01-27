# ng-ovh-sso-auth-modal-plugin

> Plugin for ng-ovh-sso-auth library.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-sso-auth-modal-plugin)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-sso-auth-modal-plugin) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-sso-auth-modal-plugin)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth-modal-plugin) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-sso-auth-modal-plugin)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth-modal-plugin?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-sso-auth-modal-plugin)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth-modal-plugin?activeTab=dependencies)

## Install

```sh
$ yarn add @ovh-ux/ng-ovh-sso-auth-modal-plugin
```

## Usage

It overrides the ng-ovh-sso-auth's handleSwitchSession function,
to display a modal when user switch:
- from connected to disconnected
- from disconnected to connected
- from connected to connected with other

```js
import angular from 'angular';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';

angular.module('myApp', [ngOvhSsoAuthModalPlugin]);
```

## Test

```sh
$ yarn test
```

## Related

- [@ovh-ux/ng-ovh-sso-auth](https://github.com/ovh/manager/tree/master/packages/components/ng-ovh-sso-auth) - OVH $http interceptor working with SSO

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
