# Manage OTRS tickets

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)](https://github.com/ovh-ux/ovh-angular-otrs/blob/master) [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-otrs.svg)](https://travis-ci.org/ovh-ux/ovh-angular-otrs)

[![NPM](https://nodei.co/npm/ovh-angular-otrs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-otrs/)

# Installation

## Bower

```sh
bower install ovh-angular-otrs --save
```

## NPM

```sh
npm install ovh-angular-otrs --save
```

# Howto's

Inject module

```js
angular.module("myApp", ["ovh-angular-otrs"]);
```

Inject it to manager-navbar at app.config:

```js
angular.module("myApp")
    .config((OtrsPopupProvider) => {
        OtrsPopupProvider.setBaseUrlTickets("…");
    });
```

```js
…
const assistanceMenu = [];

assistanceMenu.push({
    title: $translate.instant("otrs_menu_new_ticket"),
    click: (callback) => {
        if (!OtrsPopupService.isLoaded()) {
            OtrsPopupService.init();
        } else {
            OtrsPopupService.toggle();
        }

        if (_.isFunction(callback)) {
            callback();
        }
    }
});
…
```

## Get the sources

```sh
git clone https://github.com/ovh-ux/ovh-angular-otrs.git
cd ovh-angular-otrs
npm install
bower install
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-otrs/blob/master/CONTRIBUTING.md)

## Run the tests

```sh
npm test
```

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-otrs/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-otrs/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-otrs

# License

See https://github.com/ovh/ovh-angular-otrs/blob/master/LICENSE.md
