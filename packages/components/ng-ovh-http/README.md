# ovh-angular-http

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-http.svg)](https://travis-ci.org/ovh-ux/ovh-angular-http)

[![NPM](https://nodei.co/npm/ovh-angular-http.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-http/)

> Simple http provider for OVH API.

## Installation

### Bower

```sh
$ bower install ovh-angular-http --save
```

### NPM

```sh
$ npm install ovh-angular-http --save
```

## Get the sources

```sh
$ git clone https://github.com/ovh-ux/ovh-angular-http.git
$ cd ovh-angular-http
$ npm install
$ bower install
```

## Configuration

```js
import angular from 'angular';
import set from 'lodash/set';

angular
  .module('myApp', [])
  .config(/* @ngInject */ (OvhHttpProvider, constants) => {
    // URL prefix
    set(OvhHttpProvider, 'rootPath', constants.swsRootPath);
    // Auto delete get cache (for this url) if method is in table
    set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
    // By default, request return response.data
    set(OvhHttpProvider, 'returnSuccessKey', 'data');
    // By default, request return error.data
    set(OvhHttpProvider, 'returnErrorKey', 'data');
  });
```

## Usage

<!-- eslint-skip -->

```js
  // HTTP request
  OvhHttp["get", "put", "post", "delete"](URL, options);

  // Get API schema (option only rootPath)
  OvhHttp.schema(URL, options);

  // Get specifically enum of API schema (option only rootPath)
  OvhHttp.models(URL, enumName, options);

  // return window.encodeURIComponent(param);
  OvhHttp.encode(param);
```

## Options

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
  // clear cache of this url (boolean) or specifique cache (String or String[])
  clearCache,
  // (String, String[], boolean)
  // clear all cache of this cache (boolean) or specifique cache (String or String[])
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

angular
  .module('myApp', [])
  .controller('MyCtrl', class MyCtrl {
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
  });
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-http/blob/master/CONTRIBUTING.md)

## Related links

* Contribute: https://github.com/ovh-ux/ovh-angular-http/blob/master/CONTRIBUTING.md
* Report bugs: https://github.com/ovh-ux/ovh-angular-http/issues
* Get latest version: https://github.com/ovh-ux/ovh-angular-http

## License

See https://github.com/ovh-ux/ovh-angular-http/blob/master/LICENSE
