![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ng-at-internet.svg)](https://travis-ci.org/ovh-ux/ng-at-internet)

# ng-at-internet

AT Internet tracking js library wrapper for AngularJS.

## Install

### Bower

```bash
$ bower install ng-at-internet --save
```

### NPM

Available soon

## Get the sources

```bash
$ git clone https://github.com/ovh-ux/ng-at-internet.git
$ cd ng-at-internet
$ npm install
$ bower install
```


## Getting Started

Before using this component please make sure that ATInternet JS library : smarttag.js is linked in your project.

```html
<script src="angular.js"></script>
<script src="smarttag-yourproject.js"></script>
<script src="ng-at-internet.js"></script>
```
## Documentation

Please see : http://developers.atinternet-solutions.com/accueil/

## Provider configuration

Example provider configuration

```javascript
app.config(["atInternetProvider", function(provider) {
    provider.setEnabled(true); // enable tracking
    //provider.setDebug(true);
    provider.setDefaults({ level2: "1"}); // it is recommended to specify the level2 attribute as a default value
                                          // since it is global to your project and it must be send allong with
                                          // every tracking data
}])
```

Please note that the level2 attribute must be your project ID ; configured in ATInternet manager.

## Page tracking

Example of tracking a single page.

```javascript
atInternet.trackPage({
    name: "my-page",  // page name
    level2: "1"       // (optional) if not configured in defaults you must specify your project id
});
```

## Click tracking

Example of tracking a click action.

```javascript
atInternet.trackClick({
    name: "my-click", // name of action
    type: "action"    // Possible values : action/navigation/download/exit
    level2: "1"       // (optional) if not configured in defaults you must specify your project id
});
```
Tracking using the directive :

```html
<button at-internet-click="{ name: 'foo' }" ng-click="clickMe()">ClickMe</button>
<a target="#" at-internet-click="{ name: 'foo' }">ClickMe</a>
```

## Order tracking

Example of tracking a successfull order.

```javascript
/**
 * Please note that you must supply a product price with one of the following attributes : 'price', 'priceTaxFree' (you can also supply both price values, with and without taxes if you want).
 */
atInternet.trackOrder({
    page: "pageName",     // page of the order
    name: "my-product",   // name of your product
    price: 42,            // taxes included product price
    //priceTaxFree: 42,   // price tax free
    level2: "1"           // (optional) if not configured in defaults you must specify your project id
});
```

Example of tracking a custom event.

```javascript
atInternet.trackEvent({
    page: "pageName",   // page that raised the event
    event: "eventName", // raised event
    level2: "1"         // (optional) if not configured in defaults you must specify your project id
});
```


You can use:
------------

  - `grunt` : to build.
  - `grunt watch` : will rebuild your project when a file change. Also re-launch Karma when a spec file change.
  - `grunt test` : to test specs files with Karma/Jasmine.
  - `grunt release --type=major|minor|patch` : to release your module.


# Contributing

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ng-at-internet/blob/master/CONTRIBUTING.md)

## Run the tests

```
$ npm test
```

## Related links

* Contribute: https://github.com/ovh-ux/ng-at-internet/blob/master/CONTRIBUTING.md
* Report bugs: https://github.com/ovh-ux/ng-at-internet/issues
* Get latest version: https://github.com/ovh-ux/ng-at-internet

# License

See https://github.com/ovh-ux/ng-at-internet/blob/master/LICENSE
