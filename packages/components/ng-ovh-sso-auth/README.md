# ng-ovh-sso-auth

> OVH $http interceptor working with SSO. Can be used with $resource!

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-sso-auth)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-sso-auth) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-sso-auth)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-sso-auth)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-sso-auth)](https://npmjs.com/package/@ovh-ux/ng-ovh-sso-auth?activeTab=dependencies)

## Install

```sh
$ pnpm install @ovh-ux/ng-ovh-sso-auth
```

# Usage

```js
import angular from 'angular';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';

angular
  .module('myApp', [ngOvhSsoAuth])
  .config(
    /* @ngInject */ ($httpProvider, constants, ssoAuthenticationProvider) => {
      ssoAuthenticationProvider.setLoginUrl(
        constants.prodMode ? constants.loginUrl : 'auth.html',
      );

      ssoAuthenticationProvider.setLogoutUrl(
        constants.prodMode
          ? '/engine/api/auth/logout'
          : 'api/proxypass/auth/logout',
      );

      ssoAuthenticationProvider.setUserUrl(
        constants.prodMode ? '/engine/api/me' : 'api/user',
      );

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
    },
  )
  .run(
    /* @ngInject */ (ssoAuthentication) => {
      ssoAuthentication.login().then(() => {
        // Do what you want after login.
      });
    },
  );
```

## Test

```sh
$ pnpm test
```

## Related

- [@ovh-ux/ng-ovh-sso-auth-modal-plugin](https://github.com/ovh/manager/tree/master/packages/components/ng-ovh-sso-auth-modal-plugin) - OVH SSO module - Modal plugin

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
