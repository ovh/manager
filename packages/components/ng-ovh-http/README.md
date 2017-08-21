# ovh-angular-http

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-http.svg)](https://travis-ci.org/ovh-ux/ovh-angular-http)

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
.config(["OvhHttpProvider", "constants", function (OvhHttpProvider, constants) {
    "use strict";
    OvhHttpProvider.rootPath = constants.swsRootPath; // URL prefix
    OvhHttpProvider.clearCacheVerb = ["POST", "PUT", "DELETE"]; // Auto delete get cache (for this url) if method is in table
    OvhHttpProvider.returnSuccessKey = 'data'; // By default, requeste return response.data
    OvhHttpProvider.returnErrorKey = 'data'; // By default, requeste return error.data
}])
```

## Usage

```js
    // http request
    OvhHttp.["get", "put", "post", "delete"](URL, options); (promise)

    // get API schema (option only rootPath)
    OvhHttp.schema(URL, options); (promise)

    // get specifically enum of API schema (option only rootPath)
    OvhHttp.models(URL, enumName, options); (promise)

    // return window.encodeURIComponent(param);
    OvhHttp.encode(param);
```

## Options

```js
 options = {
    method:           // get post put or delete
    url:              // url of sws or proxypass
    urlParams:        // params of url (replace {*})
    data:             // data of body for POST and PUT
    params:           // params in URL
    cache:            // cache key (String)
    clearCache:       // (String, String[], boolean) clear cache of this url (boolean) or specifique cache (String or String[])
    clearAllCache:    // (String, String[], boolean) clear all cache of this cache (boolean) or specifique cache (String or String[])
    encodeParams:     // Encode params
    encodeUrlParams:  // Encode url params

    // Override provider conf
    returnSuccessKey: // (String or empty string) return specific key (first level) (empty for return all)
    returnErrorKey:   // (String or empty string) return specific key (first level) (empty for return all)
    rootPath:         // prefix url (provider conf)
    clearCacheVerb:   // table of [PUT POST DELETE]. remove automatically cache of url if method is in table(provider conf)
 }
```

## Example

```js
    this.getSelected = function (forceRefresh) {
        return OvhHttp.get("hosting/web/{serviceName}", {
            urlParams: {
                serviceName: $routeParams.productId
            },
            clearCache: forceRefresh,
            cache: "hostingCache"
        });
    };

    this.flushCdn = function () {
        return OvhHttp.post("proxypass/hosting/web/{serviceName}/request", {
            urlParams: {
                serviceName: $routeParams.productId
            },
            data: {
                action: "FLUSH_CACHE"
            }
            clearAllCache: "hostingCache" // or ["hostingCache"]
        });
    };
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
