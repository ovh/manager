# ng-log-to-customer

> AngularJS log to customer module.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-log-to-customer)](https://www.npmjs.com/package/@ovh-ux/ng-log-to-customer) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-log-to-customer)](https://npmjs.com/package/@ovh-ux/ng-log-to-customer) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-log-to-customer)](https://npmjs.com/package/@ovh-ux/ng-log-to-customer?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-log-to-customer)](https://npmjs.com/package/@ovh-ux/ng-tail-logs?activeTab=dependencies)

Poll a log API for displaying messages

## Install

```sh
$ yarn add @ovh-ux/ng-log-to-customer
```

## Usage

```js
import angular from 'angular';
import '@ovh-ux/ng-log-to-customer';

angular.module('myApp', [ngLogToCustomer]).controller(
  'MyCtrl',
  /* @ngInject */ () => {
    /** Pass keys information as an objet with keyNames and path in API returned data
     * Note : _id is mandatory since it ensure a log is unique */
    this.logKeys = {
      _id: 'message._id',
      requestReceivedTimestamp: 'message.audit_requestReceivedTimestamp_date',
      verb: 'message.audit_verb',
      authorizationDecision: 'message.audit_authorizationDecision',
      responseStatus: 'message.audit_responseStatus',
      user: 'message.audit_user',
      requestURI: 'message.audit_requestURI',
    };

    this.logSrcUrl = 'http://my-log-url';
  },
);
```

```html
<div data-ng-controller="MyCtrl as $ctrl">
  <log-to-customer source="$ctrl.logSrcUrl" log-keys="$ctrl.logKeys">
    
    <!--Optionnal : right tile transclude content-->
    <right-tile>Content will be placed right to the live tail. Tail will be fullscreen if no content is passed.</right-tile>
  </log-to-customer>
</div>
```

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
