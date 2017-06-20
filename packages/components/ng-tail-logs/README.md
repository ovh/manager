
[Poll a log API for displaying messages](https://github.com/ovh-ux/ovh-tail-logs)
 
 
[![Build Status](https://travis-ci.org/ovh/ovh-tail-logs.svg)](https://travis-ci.org/ovh/ovh-tail-logs)
 
```javascript
    angular.module("myapp", ["ovh-tail-logs"]).controller("myCtrl", function ($q, OvhTailLogs) {
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

    bower install ssh://git@github.com:ovh-ux/ovh-tail-logs.git --save

## NPM

    npm install ssh://git@github.com:ovh-ux/ovh-tail-logs.git --save

 
# Configuration
 
1. Include `ovh-tail-logs.css` in your app:

  `<link rel="stylesheet" href="bower_components/ovh-tail-logs/dist/ovh-tail-logs.css"/>`

2. Include `ovh-tail-logs.js` in your app:

  `<script src="bower_components/ovh-tail-logs/dist/ovh-tail-logs.js"></script>`

3. Add `ovh-tail-logs` as a new module dependency in your angular app.

  `var myapp = angular.module('myapp', ['ovh-tail-logs']);`
 
## Get the sources
 
```bash
    git clone https://github.com/ovh/ovh-tail-logs.git
    cd ovh-tail-logs
    npm install
    bower install
```
 
You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-tail-logs/blob/master/CONTRIBUTING.md)

## Build the documentation
```
grunt ngdocs
```
 
# Related links
 
 * Contribute: https://github.com/ovh/ovh-tail-logs
 * Report bugs: https://github.com/ovh/ovh-tail-logs/issues
 * Get latest version: https://github.com/ovh-ux/ovh-tail-logs
 
# License
 
See https://github.com/ovh/ovh-tail-logs/blob/master/LICENSE
