# Toaster

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-toaster.svg)](https://travis-ci.org/ovh-ux/ovh-angular-toaster)

> A factory to create toast

Toaster is a component to show an in-app notification, like a [toast](http://developer.android.com/guide/topics/ui/notifiers/toasts.html) for android applications.

# Example

Require Angular module `toaster`.
If you need to change theme or css classes, you can define it inside module configuration like this:

 ```javascript
 angular.module("myApp", ['ovh-angular-toaster']).config(function (ToastProvider) {

	 // CSS classes
     ToastProvider.setExtraClasses('messenger-fixed messenger-on-bottom messenger-on-right');

     // Graphic theme
     ToastProvider.setTheme('air');

     // Set duration
     ToastProvider.setHideAfter(42);
 });
 ```

 To add a notification, you had to inject Toast as dependency and use it like this example inside a controller

 ```javascript
 angular.module('myApp').controller('iLikeLicorn',[ 'Toast', function (Toast) {
     "use strict";

     Toast.success("Licorns eat toast?");

 }]);
 ```
 Toast can by targetted with an ID. So, you can update a toast on-the-fly, like this:

 ```javascript
 Toast.info('Loading...', {
     id: 42,
     hideAfter: false
 });

 $timeout(function () {
     Toast.success('Done!', {
         id: 42
     });
 }, 2000);
 ```

 Also, a main Toast fct returns the instance of the Toast created. Then you can play with it!

 ```javascript
 var msg = Toast.info('Hello!', {
     hideAfter: false
 });

 $timeout(function () {
     Toast.hide(msg);
     $timeout(function () {
         Toast.show(msg);
     }, 2000);
 }, 2000);
 ```

## Installation

## Bower

    bower install ovh-angular-toaster --save

## NPM

    npm install ovh-angular-toaster --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-toaster.git
    cd ovh-angular-toaster
    npm install
    bower install
```

### __Warning__
By default, CSS from messenger dependency download fonts from google...
Two themes are banned :
* __air__
* __ice__

__Don't forgot to disable CSS loading!!!__

Toaster include version of these themes without fonts dependencies.
To avoid loading CSS file, you had to exclude theses files into your wiredep (in gruntfile.js), like this:

```javascript
wiredep: {
  target: {
    ...
    exclude: [
        'bower_components/messenger/build/css/messenger-theme-air.css',              'bower_components/messenger/build/css/messenger-theme-ice.css']
  }
},
```

## Features

 * Show a notification with _success, error, info_ or _light_ mode.
 * Can by update on-the-fly!
 * Automatically hidden by default.
 * Doesn't translate message by default. The best way is to translate before send message to Toaster.

## Dependencies

 * [Messenger](https://github.com/HubSpot/messenger)
 * ngSanitize


## API

### Main functions

 * __Toast.success(message, parameters)__ show a success notification.
 * __Toast.info(message, parameters)__ show an information notification.
 * __Toast.error(message, parameters)__ show an error notification.
 * __Toast.light(message, parameters)__ show a light notification.

 __Params:__
  * __message__: message to show
  * __parameters__: Object to configure lib use to show notification. Please report to [Messenger repo](https://github.com/HubSpot/messenger) documentation. Inside parameters, you can add all parameters from Messenger library: [Messenger documentation](https://github.com/HubSpot/messenger/blob/master/docs/intro.md)

 __Returns:__
  * __notification__: the instance of the Toast.

### Others functions

 * __Toast.infoWithInProgress(messageProgress, message, parameters)__ show a info notification with progress information. Return notification reference.
 * __Toast.update(notification, message, parameters)__ update message inside notification. Return operation status.
 * __Toast.show(notification)__ show a specific notification. Return operation status.
 * __Toast.hide(notification)__ hide a specific notification. Return operation status.
 * __Toast.hideAll()__ hide all notification. Return operation status.



 You've developed a new cool feature? Fixed an annoying bug? We'd be happy
 to hear from you!

 Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-toaster/blob/master/CONTRIBUTING.md)

 ## Run the tests

 ```
 npm test
 ```

 ## Build the documentation

 ```
 grunt ngdocs
 ```

 # Related links

  * Contribute: https://github.com/ovh-ux/ovh-angular-toaster/CONCONTRIBUTING.md
  * Report bugs: https://github.com/ovh-ux/ovh-angular-toaster/issues
  * Get latest version: https://github.com/ovh-ux/ovh-angular-toaster

 # License

 See https://github.com/ovh-ux/ovh-angular-toaster/blob/master/LICENSE
