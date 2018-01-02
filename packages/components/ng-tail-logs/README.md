# ovh-angular-tail-logs

![OVH component](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![NPM](https://nodei.co/npm/ovh-angular-tail-logs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-tail-logs/)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)

[Poll a log API for displaying messages](https://github.com/ovh-ux/ovh-angular-tail-logs)


[![Build Status](https://travis-ci.org/ovh/ovh-angular-tail-logs.svg)](https://travis-ci.org/ovh/ovh-angular-tail-logs)

```javascript
    angular.module("myapp", ["ovh-angular-tail-logs"]).controller("myCtrl", function ($q, OvhTailLogs) {
        this.logger = new OvhTailLogs({
            source: function () {
                return $q.when("http://my-log-url");
            },
            delay: 2000
        });

    });
```

```html
<div data-ng-controller="myCtrl as Ctrl">
    <ovh-tail-logs>
        <div data-ng-repeat="log in Ctrl.logger.logs track by $index"
            data-ng-bind="log.message">
        </div>
    </ovh-tail-logs>
</div>
```

# Installation

## Bower

    bower install ovh-angular-tail-logs --save

## NPM

    npm install ovh-angular-tail-logs --save


# Configuration

1. Include `ovh-angular-tail-logs.css` in your app:

  `<link rel="stylesheet" href="bower_components/ovh-angular-tail-logs/dist/ovh-angular-tail-logs.css"/>`

2. Include `ovh-angular-tail-logs.js` in your app:

  `<script src="bower_components/ovh-angular-tail-logs/dist/ovh-angular-tail-logs.js"></script>`

3. Add `ovh-angular-tail-logs` as a new module dependency in your angular app.

  `var myapp = angular.module('myapp', ['ovh-angular-tail-logs']);`

## Get the sources

```bash
    git clone https://github.com/ovh/ovh-angular-tail-logs.git
    cd ovh-angular-tail-logs
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-tail-logs/blob/master/CONTRIBUTING.md)

## Build the documentation
```
grunt ngdocs
```

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-tail-logs
 * Report bugs: https://github.com/ovh-ux/ovh-angular-tail-logs/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-tail-logs

# License

See https://github.com/ovh-ux/ovh-angular-tail-logs/blob/master/LICENSE
