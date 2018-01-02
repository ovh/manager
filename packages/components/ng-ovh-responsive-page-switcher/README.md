# ovh-angular-responsive-page-switcher

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-responsive-page-switcher.svg)](https://travis-ci.org/ovh-ux/ovh-angular-responsive-page-switcher)

[![NPM](https://nodei.co/npm/ovh-angular-responsive-page-switcher.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-responsive-page-switcher/)

> `ovh-angular-responsive-page-switcher` module is a set of 2 directives (`responsive-switch` and `responsive-switch-page`) that enable to display content like pages.

It detects available width for displaying page in 2 distinct modes :

* `switch` mode : one page is displayed at a time ;
* `sidebyside` mode : pages are displayed side by side.

## Table of contents
* [Dependencies](#dependencies)
* [Installation](#installation)
* [Usage and example](#usage-and-example)
* [Module Components](#module-components)

## Dependencies

`ovh-angular-responsive-page-switcher` module depends on different modules :

* [matchmedia-ng](https://github.com/AnalogJ/matchmedia-ng)
* [angular-animate](https://docs.angularjs.org/api/ngAnimate)

__Note__ : `ovh-angular-responsive-page-switcher` is suitable with [ovh-angular-responsive-popover](https://github.com/ovh-ux/ovh-angular-responsive-popover).

## Installation

### Download module with bower

```bash
$ bower install ovh-angular-responsive-page-switcher --save
```

This will also download the dependencies.

### Styles

In your less file, import the ovh-angular-responsive-page-switcher.less file located in dist/less folder :

```less
@import "dist/less/ovh-angular-responsive-page-switcher.less";
```

### HTML

Load the module script, its dependencies and your app file :

```html
<script src="jquery.js" type="text/javascript"></script>
<script src="angular.js" type="text/javascript"></script>
<script src="angular-animate.js" type="text/javascript"></script>
<script src="matchmedia-ng.js" type="text/javascript"></script>
<script src="ovh-angular-responsive-page-switcher.js" type="text/javascript"></script>
<script src="your-app.js" type="text/javascript"></script>
```

### JS

Load the module in your application by adding it as a dependent module :

```javascript
angular.module('app', ['ovh-angular-responsive-popover']);
```

## Usage and example

### Usage

#### HTML

Directives `responsive-switch` and `responsive-switch-page` will be used. `responsive-switch-page` requires `responsive-switch`, so first we create this directive :

```html
<div data-responsive-switch>
    <div data-responsive-switch-page class="responsive-switch-page-left"></div>
    <div data-responsive-switch-page class="responsive-switch-page-right"></div>
</div>
```

### Example

You can run a sample example after git cloning the project by running these commands :

```bash
$ npm install
$ bower install
$ grunt serve
```

The example is now running at `http://localhost:7711/example/`.

## Module Components

### directive

| Name | Description |
| :--: | :--: |
| [responsiveSwitch](./src/responsive-switch) | Create the container of the page to switch (animate) and manage the display |
| [responsiveSwitchPage](./src/responsive-switch-page) | Create a page to display |

## Contributing

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-responsive-page-switcher/blob/master/CONTRIBUTING.md)

## Run the tests

```
$ npm test
```

## Related links

* Contribute: https://github.com/ovh-ux/ovh-angular-responsive-page-switcher/blob/master/CONTRIBUTING.md
* Report bugs: https://github.com/ovh-ux/ovh-angular-responsive-page-switcher/issues
* Get latest version: https://github.com/ovh-ux/ovh-angular-responsive-page-switcher

## License

See https://github.com/ovh-ux/ovh-angular-responsive-page-switcher/blob/master/LICENSE
