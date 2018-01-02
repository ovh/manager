![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/at-internet-ui-router-plugin.svg)](https://travis-ci.org/ovh-ux/at-internet-ui-router-plugin)

# at-internet-ui-router-plugin

Plugin for at-internet when using ui-router

## Install

### Bower

```
$ bower install at-internet-ui-router-plugin --save
```


## Get the sources

```bash
$ git clone https://github.com/ovh-ux/at-internet-ui-router-plugin.git
$ cd at-internet-ui-router-plugin
$ npm install
$ bower install
```

## Getting Started

Follow [at-internet installation](https://github.com/ovh-ux/ng-at-internet/blob/master/README.md)
In your web page:

```html
<script src="angular.js"></script>
<script src="smarttag-yourproject.js"></script>
<script src="dist/ng-at-internet.min.js"></script>
<script src="dist/at-internet-ui-router-plugin.min.js"></script>
```

## Examples

Please see at-internet documentation :
[link](https://github.com/ovh-ux/ng-at-internet/blob/master/README.md)

Configuring the provider :

```javascript
app.config(["atInternetUiRouterPluginProvider", function(provider) {
    provider.setTrackStateChange(true);
}]);
```

That's it, now every state change will send a page tracking data to AtInternet.
To disabled tracking on specific states, use the following syntax :

```javascript
$stateProvider.state("your-untracked-state", {
    url : "...",
    atInternet : {
        ignore : true // this tell AtInternet to not track this state
    }
}
```

By default, the state name will be used for the page name to be sent. If you want to modify this behavior
for a given state, please use the following syntax :

```javascript
$stateProvider.state("your-state", {
    url : "...",
    atInternet : {
        rename : "foobar" // use "foobar" as page name instead of "your-state"
    }
}
```

If you want, you can apply some filters on the states name, for example :

```javascript
app.config(["atInternetUiRouterPluginProvider", function(provider) {
    provider.addStateNameFilter(function (stateName) {
        return stateName.replace(/foo/g, "bar"); // replace all occurrences of "foo" by "bar" in states name
    }
}]);
```

## Documentation

  - `grunt` : to build.
  - `grunt watch` : will rebuild your project when a file change. Also re-launch Karma when a spec file change.
  - `grunt test` : to test specs files with Karma/Jasmine.
  - `grunt release --type=major|minor|patch` : to release your module.

# Contributing

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/at-internet-ui-router-plugin/blob/master/CONTRIBUTING.md)

## Run the tests

```
$ npm test
```

## Related links

 * Contribute: https://github.com/ovh-ux/at-internet-ui-router-plugin/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/at-internet-ui-router-plugin/issues
 * Get latest version: https://github.com/ovh-ux/at-internet-ui-router-plugin

# License

See https://github.com/ovh-ux/at-internet-ui-router-plugin/blob/master/LICENSE

