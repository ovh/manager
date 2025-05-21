# ng-ovh-http

> Simple HTTP provider for OVHcloud API.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-http)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-http) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-http)](https://npmjs.com/package/@ovh-ux/ng-ovh-http) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-http)](https://npmjs.com/package/@ovh-ux/ng-ovh-http?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-http)](https://npmjs.com/package/@ovh-ux/ng-ovh-http?activeTab=dependencies)

## Install

```sh
$ pnpm install @ovh-ux/ng-ovh-http
```

## Usage

```js
import angular from 'angular';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import set from 'lodash/set';

angular.module('myApp', [ngOvhHttp]).config(
  /* @ngInject */ (OvhHttpProvider, constants) => {
    // URL prefix
    set(OvhHttpProvider, 'rootPath', constants.swsRootPath);
    // Auto delete get cache (for this url) if method is in table
    set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    // By default, request return response.data
    set(OvhHttpProvider, 'returnSuccessKey', 'data');
    // By default, request return error.data
    set(OvhHttpProvider, 'returnErrorKey', 'data');
  },
);
```

```js
// HTTP request
OvhHttp[('get', 'put', 'post', 'delete')](URL, options);

// Get API schema (option only rootPath)
OvhHttp.schema(URL, options);

// Get specifically enum of API schema (option only rootPath)
OvhHttp.models(URL, enumName, options);

// return window.encodeURIComponent(param);
OvhHttp.encode(param);
```

### Options

```js
const options = {
  // get post put or delete
  method,
  // url of sws or proxypass
  url,
  // params of url (replace {*})
  urlParams,
  // data of body for POST and PUT
  data,
  // params in URL
  params,
  // cache key (String)
  cache,
  // (String, String[], boolean)
  // clear cache for this URL (boolean) or specific cache (String or String[])
  clearCache,
  // (String, String[], boolean)
  // clear all cache of this cache (boolean) or specific cache (String or String[])
  clearAllCache,
  // Encode params
  encodeParams,
  // Encode url params
  encodeUrlParams,

  // Override provider conf
  // (String or empty string) return specific key (first level) (empty for return all)
  returnSuccessKey,
  // (String or empty string) return specific key (first level) (empty for return all)
  returnErrorKey,
  // prefix url (provider conf)
  rootPath,
  // table of [PUT POST DELETE].
  // remove automatically cache of url if method is in table(provider conf)
  clearCacheVerb,
};
```

## Example

```js
import angular from 'angular';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';

angular.module('myApp', [ngOvhHttp]).controller(
  'MyCtrl',
  class MyCtrl {
    /* @ngInject */
    constructor(OvhHttp) {
      this.OvhHttp = OvhHttp;
    }

    getSelected(forceRefresh) {
      return this.OvhHttp.get('hosting/web/{serviceName}', {
        urlParams: {
          serviceName: $routeParams.productId,
        },
        clearCache: forceRefresh,
        cache: 'hostingCache',
      });
    }

    flushCdn() {
      return this.OvhHttp.post('proxypass/hosting/web/{serviceName}/request', {
        urlParams: {
          serviceName: $routeParams.productId,
        },
        data: {
          action: 'FLUSH_CACHE',
        },
        clearAllCache: 'hostingCache', // or ['hostingCache']
      });
    }
  },
);
```

## Test

```sh
$ pnpm test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
