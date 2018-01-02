# ovh-angular-contact

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-contact.svg)](https://travis-ci.org/ovh-ux/ovh-angular-contact)

[![NPM](https://nodei.co/npm/ovh-angular-contact.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-contact/)

> ovh-angular-contact helps you dealing with ovh contacts from [/me/contact](https://api.ovh.com/console/#/me/contact#GET) API.

## Features

- selecting a contact and editing it;
- creating a new ovh contact.

## Todo

- add some callbacks (onEdit, onAdd, ...);
- maybe add a directive that list contacts?

## Installation

**IMPORTANT NOTE:** as "ovh-angular-contact" component use "ovh-api-services" you **NEED** to have [ovh-api-services](https://github.com/ovh-ux/ovh-api-services) to be loaded and injected into your app!

## Bower

```sh
$ bower install ovh-angular-contact --save
```

## NPM

```sh
$ npm install ovh-angular-contact --save
```

Then inject actionsMenu module in your module declaration:

```js
angular.module("myModule", [
    ...
    "ovh-angular-contact",
    ...
]);
```

## Get the sources

```sh
git clone https://github.com/ovh-ux/ovh-angular-contact.git
cd ovh-angular-contact
npm install
bower install
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-contact/blob/master/CONTRIBUTING.md)


## Documentation

For a full documentation of the module, launch:

```sh
$ grunt ngdocs && grunt connect
```

Then go on `http://localhost:9090`.

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-contact/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-contact/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-contact

# License

See https://github.com/ovh-ux/ovh-angular-contact/blob/master/LICENSE
