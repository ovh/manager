# ng-ovh-swimming-poll

> A poller to swim easily to success status!

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-swimming-poll)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-swimming-poll) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-swimming-poll)](https://npmjs.com/package/@ovh-ux/ng-ovh-swimming-poll) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-swimming-poll)](https://npmjs.com/package/@ovh-ux/ng-ovh-swimming-poll?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-swimming-poll)](https://npmjs.com/package/@ovh-ux/ng-ovh-swimming-poll?activeTab=dependencies)

## Install

```sh
$ yarn add @ovh-ux/ng-ovh-swimming-poll
```

## Usage

```js
import angular from 'angular';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';

angular.module('myApp', [ngOvhSwimmingPoll]);
```

### Features

- Understand standard Task states
- Customizable states (with object or function)
- Can share the result between different scopes
- Can retry when error rejection is triggered (with retryMaxAttempts, retryCountAttempts and retryTimeoutDelay task options)

### With OVH standard task

The poller can manage return from OVH Task standard. This library understand OVH status and return promise when the task is finished.

```js
function createPoller(Poller) {
  const url = '/task/42';
  Poller.poll(
    url,
    null, // params
    {
      namespace: 'a_namespace',
      method: 'get',
      scope: $scope.$id,
    },
  ).then(
    (result) => {
      console.log('result contains http response if task status is successful');
    },
    (result) => {
      console.log(
        'result contains http response if task status is in error state',
      );
    },
    (result) => {
      console.log(
        'result contains http response if task status is in pending state',
      );
    },
  );
}
```

### With custom validation rules

When you want to poll another thing that an OVH task, you had to define your custom validation rules.

```js
function createPoller(Poller) {
  const url = '/ip/192.168.1.1/status';
  Poller.poll(
    url,
    {
      headers: 'demo',
    },
    {
      namespace: 'a_namespace',
      method: 'get',
      scope: $scope.$id,
      successRule: {
        status: 'yeah_it_works',
        billingStatus(elem) {
          return elem.billing.status === 'nietMeerGeld';
        },
      },
      errorRule: {
        status: 'oh_damned',
        billingStatus(elem) {
          return elem.billing.status === 'verdom';
        },
      },
    },
  ).then(
    (result) => {
      console.log('result contains http response if status is yeah_it_works');
    },
    (result) => {
      console.log('result contains http response if status is oh_damned');
    },
    (result) => {
      console.log(
        'result contains http response if status is not oh_damned and not yeah_it_works',
      );
    },
  );
}
```

### With custom validations rules, on a listing

You can do a polling on listing request. In this case:
* promise will return success when all elements of the list are successful.
* promise will return error when one element or more in the list is in error state and all other are in success state
* else, promise will send a notify with the http response

```js
function createPoller(Poller) {
  const url = '/ip';
  Poller.poll(
    url,
    {
      headers: 'demo',
    },
    {
      namespace: 'a_namespace',
      method: 'get',
      scope: $scope.$id,
      successRule: {
        status: 'yeah_it_works',
        billingStatus(elem) {
          return elem.billing.status === 'nietMeerGeld';
        },
      },
      errorRule: {
        status: 'oh_damned',
        billingStatus(elem) {
          return elem.billing.status === 'verdom';
        },
      },
    },
  ).then(
    (result) => {
      console.log(
        'result contains http response if all statuses are yeah_it_works',
      );
    },
    (result) => {
      console.log(
        'result contains http response if one or more status is oh_damned and other yeah_it_works',
      );
    },
    (result) => {
      console.log(
        'result contains http response if one or more status is not a finalized status',
      );
    },
  );
}
```

### With time interval

You can specify the interval as a fix value or a function

```js
function createPoller(Poller) {
  const url = '/task/42';
  Poller.poll(
    url,
    null, // params
    {
      namespace: 'a_namespace',
      method: 'get',
      scope: $scope.$id,
      interval(iteration) {
        return 10 * Math.exp(iteration);
      },
    },
  ).then(
    (result) => {
      console.log('result contains http response if task status is successful');
    },
    (result) => {
      console.log(
        'result contains http response if task status is in error state',
      );
    },
    (result) => {
      console.log(
        'result contains http response if task status is in pending state',
      );
    },
  );
}
```

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
