# An angular service to create/get/delete user preferences

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

![Maintenance](https://img.shields.io/maintenance/yes/2018.svg) [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)

[![NPM](https://nodei.co/npm/ovh-angular-user-pref.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-user-pref/)
 
+ If you want to create/overide an user preference :

```javascript
ovhUserPref.create('COMMON_LANG', { name: 'Français', value: 'fr_FR' })
    .then(function () {
        console.log('Configuration added');
    });
```

+ If you want to extend/merge an user preference, creates the key if it doesn't exist :

```javascript
ovhUserPref.assign('COMMON_LANG', { value: 'fr_CA' })
    .then(function () {
        console.log('Configuration merged');
    });
```

+ If you want to get an user preference for a specific key :

```javascript
ovhUserPref.getValue('COMMON_LANG')
    .then(function (lang) {
        //The format of returned object is like {key: 'COMMON_LANG', value: { name: 'Français', value: 'fr_FR' }}
    });
```

+ If you want to get all user preference keys of this user :

```javascript
ovhUserPref.getKeys()
    .then(function (keys) {
        //The format of returned object is an array
    });
```

+ If you want to remove user preference for a specific key :

```javascript
ovhUserPref.remove('COMMON_LANG')
    .then(function () {
        console.log('Key deleted');
    });
```
 
# Installation

## Bower

    bower install ovh-angular-user-pref --save

## NPM

    npm install ovh-angular-user-pref --save
 
 
# Howto's

## Prerequisites

+ Format :
    -   The format of a key must be in uppercase, words separated by underscores `_`
    -   Key name sample : (`COMMON_LANG`, `WEB_DOMAIN_FAVORITES`, `DEDICATED_DASHBOARD`, ...)

## Documentation

Features:
---------

  -     Create an user preference on api.ovh.com
  -     Merge an existing user preference on api.ovh.com
  -     Get all keys of user preference for one user
  -     Get user preference for a specific key
  -     Delete an user preference for a specific key
 
# Configuration

In your web page:

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/ovh-angular-user-pref/dist/ovh-angular-user-pref.min.js"></script>
```
 
## Get the sources
 
```bash
    git clone https://github.com/ovh-ux/ovh-angular-user-pref.git
    cd ovh-angular-user-pref
    npm install
    bower install
```
 
You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-user-pref/blob/master/CONTRIBUTING.md)
 
## Run the tests
 
```
npm test
```
 
## Build the documentation
 
```
grunt ngdocs
```
 
# Related links
 
 * Contribute: https://github.com/ovh-ux/ovh-angular-user-pref/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-user-pref/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-user-pref
 
# License
 
See https://github.com/ovh/ovh-angular-user-pref/blob/master/LICENSE
