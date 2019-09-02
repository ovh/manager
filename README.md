# ng-ovh-sso-auth

> OVH $http interceptor working with SSO. Can be used with $resource!

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-sso-auth)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth) [![Dependencies](https://badgen.net/david/dep/ovh-ux/ng-ovh-sso-auth)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/ng-ovh-sso-auth)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
yarn add @ovh-ux/ng-ovh-sso-auth
```

# Usage

```js
import angular from 'angular';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';

angular
  .module('myApp', [
    ngOvhSsoAuth,
  ])
  .config(/* @ngInject */($httpProvider, constants, ssoAuthenticationProvider) => {
    ssoAuthenticationProvider
      .setLoginUrl(constants.prodMode ? constants.loginUrl : 'auth.html');

    ssoAuthenticationProvider
      .setLogoutUrl(constants.prodMode ? '/engine/api/auth/logout' : 'api/proxypass/auth/logout');

    ssoAuthenticationProvider
      .setUserUrl(constants.prodMode ? '/engine/api/me' : 'api/user');

    const configuration = [
      {
        serviceType: 'api',
        urlPrefix: 'api',
      },
      {
        serviceType: 'aapi',
        urlPrefix: constants.prodMode ? '../2api-m' : '2api-m',
      },
      {
        serviceType: 'apiv6',
        urlPrefix: 'apiv6',
      },
    ];

    ssoAuthenticationProvider.setConfig(configuration);

    $httpProvider.interceptors.push('OvhSsoAuthInterceptor');
  })
  .run(/* @ngInject */(ssoAuthentication) => {
    ssoAuthentication
      .login()
      .then(() => {
        // Do what you want after login.
      });
  });
```

## Test

```sh
yarn test
```

## Related

- [ng-ovh-sso-auth-modal-plugin](https://github.com/ovh-ux/ng-ovh-sso-auth-modal-plugin)

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh-ux/ng-ovh-sso-auth/issues/new) or working on some of the [open issues](https://github.com/ovh-ux/ng-ovh-sso-auth/issues), our [contributing guide](CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
