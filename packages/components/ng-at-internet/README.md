# ng-at-internet

> AT Internet tracking js library wrapper for AngularJS.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-at-internet)](https://www.npmjs.com/package/@ovh-ux/ng-at-internet) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-at-internet)](https://npmjs.com/package/@ovh-ux/ng-at-internet) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-at-internet)](https://npmjs.com/package/@ovh-ux/ng-at-internet?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-at-internet)](https://npmjs.com/package/@ovh-ux/ng-at-internet?activeTab=dependencies) [![Gitter](https://badgen.net/badge/gitter/ovh-ux/blue?icon=gitter)](https://gitter.im/ovh/ux)

## Install

```sh
$ yarn add @ovh-ux/ng-at-internet
```

## Usage

Before using this component please make sure that ATInternet JS library: smarttag.js is linked in your project.

```js
import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';

angular.module('myApp', [ngAtInternet]);
```

### Provider configuration

*Example simple provider configuration*

```js
app.config([
  'atInternetProvider',
  function(provider) {
    provider.setEnabled(true); // enable tracking
    // provider.setDebug(true);
    provider.setDefaults({ level2: '1' }); // it is recommended to specify the level2 attribute as a default value
    // since it is global to your project and it must be send allong with
    // every tracking data
  },
]);
```

Please note that the level2 attribute must be your project ID ; configured in ATInternet manager.

*Exemple provider configuration with identifiedVisitor set.*

```js
app.config([
  'atInternetProvider',
  function(provider) {
    provider.setEnabled(true); // enable tracking
    // provider.setDebug(true);
    provider.setDefaults({
      level2: '1',
      visitorId: '123',
    });
  },
]);
```

Notice that visitorId is optional and set identifiedVisitor.id ATInternet Tag.

### Page tracking

*Example of tracking a single page.*

```js
atInternet.trackPage({
  name: 'my-page', // page name
  level2: '1', // (optional) if not configured in defaults you must specify your project id
  visitorId: '123', // (optional) set identifiedVisitor.id sent with each hit
});
```

### Click tracking

*Example of tracking a click action.*

```js
atInternet.trackClick({
  name: 'my-click', // name of action
  type: 'action', // event type (optional) Possible values : action/navigation/download/exit
  level2: '1', // (optional) if not configured in defaults you must specify your project id
  visitorId: '123', // (optional) set identifiedVisitor.id sent with each hit
});
```
Tracking using the directive :

Attributes
- `track-on` : event to track (click, onFinish, onchange, etc)
- `track-name` : Name of action (optional) Id will be used if absent
- `track-type` : event type (optional) Possible values : action/navigation/download/exit

```html
<button id="btnAction" data-track-on="click"></button>
<!-- Tracking result: {name: "btnAction-click", type: "action"...} -->

<button data-track-on="mouseover" data-track-name="MyAction" data-track-type="navigation"></button>
<!-- Tracking result: {name: "MyAction", type: "navigation"...} -->

```

### Order tracking

*Example of tracking a successfull order.*

```js
/**
 * Please note that you must supply a product price with one of the following attributes:
 * - 'price'
 * - 'priceTaxFree'
 * You can also supply both price values, with and without taxes if you want.
 */
atInternet.trackOrder({
  page: 'pageName', // page of the order
  name: 'my-product', // name of your product
  price: 42, // taxes included product price (required only if priceTaxFree is not supplied)
  // priceTaxFree: 42,   // price tax free (required only if price is not supplied)
  quantity: 1, // amount of product (default is 1)
  status: 3, // status of the order (default is 3 : validated)
  level2: '1', // (optional) if not configured in defaults you must specify your project id
  visitorId: '123', // (optional) set identifiedVisitor.id sent with each hit
});
```

### Event tracking

*Example of tracking a custom event.*

```js
atInternet.trackEvent({
  page: 'pageName', // page that raised the event
  event: 'eventName', // raised event
  level2: '1', // (optional) if not configured in defaults you must specify your project id
  visitorId: '123', // (optional) set identifiedVisitor.id sent with each hit
});
```

## Test

```sh
$ yarn test
```

## Related

- [ng-at-internet-ui-router-plugin](https://github.com/ovh/manager/tree/master/packages/components/ng-at-internet-ui-router-plugin) - Plugin for AT Internet when using UI-Router

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
