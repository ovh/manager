# ovh-angular-jsplumb

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-jsplumb.svg)](https://travis-ci.org/ovh-ux/ovh-angular-jsplumb)

[![NPM](https://nodei.co/npm/ovh-angular-jsplumb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-jsplumb/)

> Allow to draw links between elements using [jsPlumb toolkit](http://www.jsplumb.org/).

## Table of contents
* [Installation](#installation)
* [Dependencies](#dependencies)
* [Example](#example)

## Installation

### Bower
```sh
bower install ovh-angular-jsplumb --save
```

### NPM
```sh
npm install ovh-angular-jsplumb --save
```

Then include ovh-angular-jsplumb.js in your HTML with it's dependencies (**Note** : As mentionned above, you can only load jquery ui dependency files) :

```html
<script src="jquery.js"></script>
<script src="jquery-ui.js"></script>
<script src="jsplumb.js"></script>
<script src="angular.js"></script>
<script src="ovh-angular-jsplumb.js"></script>
```

And then load the module in your application by adding it as a dependent module:

```js
angular.module('app', ['ovh-angular-jsplumb']);
```

### Get the sources
```sh
git clone https://github.com/ovh-ux/ovh-angular-jsplumb.git
cd ovh-angular-jsplumb
npm install
bower install
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-jsplumb/blob/master/CONTRIBUTING.md)


## Dependencies

- [jsPlumb](http://jsplumb.org)
- [jQuery UI](http://jqueryui.com/) as a dependency of jsPlumb.

If you are using grunt and grunt wiredep, overrides the jsPlumb dependency like this:

```js
wiredep: {
    overrides: {
        jsplumb: {
            main: 'dist/js/jquery.jsPlumb-1.7.3-min.js'
        },
        'jquery-ui': {
            main: [
                'ui/minified/core.min.js',
                'ui/minified/widget.min.js',
                'ui/minified/mouse.min.js',
                'ui/minified/draggable.min.js',
                'ui/minified/droppable.min.js'
            ]
        }
    }
}
```

For jQuery UI, we only need draggable and droppable functionnalities (and the few core functionnalities). So we can load only these files.


## Example
First, make sure `jsplumb` is ready by calling `jsPlumbService.jsplumbInit` method:

```js
angular.module('app').controller('myAppCtrl', function ($scope, jsPlumbService) {
    $scope.jsplumbReady = false;

    jsPlumbService.jsplumbInit()['finally'](function () {
        $scope.jsplumbReady = true;
    });
});
```

Create an instance of `ovh-angular-jsplumb` with the `jsplumbInstance` directive:

```html
<div data-ng-if="jsplumbReady"
     data-jsplumb-instance>
     …
</div>
```


## Run the tests

```sh
npm test
```


## Build the documentation

```sh
grunt ngdocs
```


## Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-jsplumb/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-jsplumb/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-jsplumb


## License

See https://github.com/ovh-ux/ovh-angular-jsplumb/blob/master/LICENSE