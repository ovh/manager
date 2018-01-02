![OVH component](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![NPM](https://nodei.co/npm/ovh-angular-browser-alert.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-browser-alert/)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)

# ovh-angular-browser-alert

Angular component to display an alert when your browser isn't supported

## Getting Started
Install dependencies :

```bash
$ yarn install
```

Test :

```bash
$ grunt test
```

Build :

```bash
$ grunt
```

## Installation

Libraries setup :

```html
<script src="angular.js"></script>
<script src="dist/ovh-angular-browser-alert.min.js"></script>
```

## Usage

Add new translations (for example) :
```xml
   <translation id="browser_alert_not_supported">Your browser is not supported and may contain security vulnerabilities.</translation>
   <translation id="browser_alert_deprecated">Your browser is not up to date and may contain security or compatibility vulnerabilities.</translation>
   <translation id="browser_alert_update">We recommend you to<a href="http://outdatedbrowser.com/fr" class="alert-link" target="_blank">update your browser</a> in order to benefit a better experience.</translation>
   <translation id="browser_alert_close">Close</translation>
```

Finally, you can use the component in your html code :
```html
<ovh-angular-browser-alert />
```

## Contributing

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-browser-alert/blob/master/CONTRIBUTING.md)

## Run the tests

```
$ npm test
```

## Related links

* Contribute: https://github.com/ovh-ux/ovh-angular-browser-alert/blob/master/CONTRIBUTING.md
* Report bugs: https://github.com/ovh-ux/ovh-angular-browser-alert/issues
* Get latest version: https://github.com/ovh-ux/ovh-angular-browser-alert

## License

See https://github.com/ovh-ux/ovh-angular-browser-alert/blob/master/LICENSE
