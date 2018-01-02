![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-swimming-poll.svg)](https://travis-ci.org/ovh-ux/ovh-angular-swimming-poll)

[![NPM](https://nodei.co/npm/ovh-angular-swimming-poll.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-swimming-poll/)

# Swimming-poll
_A poller to swim easily to success status!_


## Features

 * Understand standard Task states
 * Customizable states (with object or function)
 * Can share the result between differents scopes
 * Can retry when error rejection is triggered (with retryMaxAttempts, retryCountAttempts and retryTimeoutDelay task options)

## Install

### NPM

```
$ npm install ovh-angular-swimming-poll --save
```

### Bower

```
$ bower install ovh-angular-swimming-poll --save
```

## Get the sources

```bash
$ git clone https://github.com/ovh-ux/ovh-angular-swimming-poll.git
$ cd ovh-angular-swimming-poll
$ npm install
$ bower install
```

## How to use?

### With OVH standard task

The poller can manage return from OVH Task standard. This library understand OVH status and return promise when the task is finished.

```javascript
function (Poller) {
    var url = '/task/42';
    Poller.poll(
        url,
        null,   // params
        {
            namespace: 'a_namespace',
            method: 'get',
            scope: $scope.$id
        }
    ).then(function (result) {
        console.log('result contains http response if task status is successful');
    }, function (result) {
        console.log('result contains http response if task status is in error state');
    }, function (result) {
        console.log('result contains http response if task status is in pending state');
    });
```

### With custom validation rules

When you want to poll another thing that an OVH task, you had to define your custom validation rules.

```javascript
function (Poller) {
    var url = '/ip/192.168.1.1/status';
    Poller.poll(
        url,
        {
            headers: 'demo'
        },
        {
            namespace: 'a_namespace',
            method: 'get',
            scope: $scope.$id,
            successRule: { 
                status: 'yeah_it_works', 
                billingStatus : function (elem) {
                    return elem.billing.status === 'nietMeerGeld';
                }
            },
            errorRule: { 
                status: 'oh_damned',
                billingStatus : function (elem) {
                    return elem.billing.status === 'verdom';
                }
            }
        }
    ).then(function (result) {
        console.log('result contains http response if status is yeah_it_works');
    }, function (result) {
        console.log('result contains http response if status is oh_damned');
    }, function (result) {
        console.log('result contains http response if status is not oh_damned and not yeah_it_works');
    });
```

### With custom validations rules, on a listing

You can do a polling on listing request. In this case:
 * promise will return success when all elements of the list are successful.
 * promise will return error when one element or more in the list is in error state and all other are in success state
 * else, promise will send a notify with the http response

```javascript
function (Poller) {
    var url = '/ip';
    Poller.poll(
        url,
        {
            headers: 'demo'
        },
        {
            namespace: 'a_namespace',
            method: 'get',
            scope: $scope.$id,
            successRule: { 
                status: 'yeah_it_works', 
                billingStatus : function (elem) {
                    return elem.billing.status === 'nietMeerGeld';
                }
            },
            errorRule: { 
                status: 'oh_damned',
                billingStatus : function (elem) {
                    return elem.billing.status === 'verdom';
                }
            }
        }
    ).then(function (result) {
        console.log('result contains http response if all statuses are yeah_it_works');
    }, function (result) {
        console.log('result contains http response if one or more status is oh_damned and other yeah_it_works');
    }, function (result) {
        console.log('result contains http response if one or more status is not a finalized status');
    });
```

### With time interval

You can specify the interval as a fix value or a function

```javascript
function (Poller) {
    var url = '/task/42';
    Poller.poll(
        url,
        null,   // params
        {
            namespace: 'a_namespace',
            method: 'get',
            scope: $scope.$id,
            interval: function(iteration) {
                return 10 * Math.exp(iteration);
            }
        }
    ).then(function (result) {
        console.log('result contains http response if task status is successful');
    }, function (result) {
        console.log('result contains http response if task status is in error state');
    }, function (result) {
        console.log('result contains http response if task status is in pending state');
    });
```

# Contributing

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-swimming-poll/blob/master/CONTRIBUTING.md)

## Run the tests

```
$ npm test
```

## Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-swimming-poll/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-swimming-poll/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-swimming-poll

# License

See https://github.com/ovh-ux/ovh-angular-swimming-poll/blob/master/LICENSE
