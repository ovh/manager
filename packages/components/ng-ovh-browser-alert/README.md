# ng-ovh-browser-alert

> Display an alert when your browser isn't supported.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-browser-alert)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-browser-alert) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-browser-alert)](https://npmjs.com/package/@ovh-ux/ng-ovh-browser-alert) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-browser-alert)](https://npmjs.com/package/@ovh-ux/ng-ovh-browser-alert?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-browser-alert)](https://npmjs.com/package/@ovh-ux/ng-ovh-browser-alert?activeTab=dependencies)

## Install

```sh
$ pnpm install @ovh-ux/ng-ovh-browser-alert
```

## Usage

```js
// index.js
import ovhBrowserAlert from '@ovh-ux/ng-ovh-browser-alert';
import angular from 'angular';

angular.module('myApp', [ovhBrowserAlert]);
```

```html
<!-- index.html -->
<ovh-browser-alert></ovh-browser-alert>
```

```xml
<!-- translations/Messages_en_GB.xml -->
<translation id="browser_alert_not_supported">Your browser is not supported and may contain security vulnerabilities.</translation>
<translation id="browser_alert_deprecated">Your browser is not up to date and may contain security or compatibility vulnerabilities.</translation>
<translation id="browser_alert_update">We recommend you to<a href="http://outdatedbrowser.com/fr" class="alert-link" target="_blank">update your browser</a> in order to benefit a better experience.</translation>
<translation id="browser_alert_close">Close</translation>
```

## Test

```sh
$ pnpm test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
