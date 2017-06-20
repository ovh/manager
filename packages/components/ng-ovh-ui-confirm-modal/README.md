![OVH component deprecated](githubBannerDeprecated.png)

# Angular UI Confirm Modal
Simple confirmation modal

![deprecated](https://img.shields.io/badge/status-deprecated-red.svg) [![Build Status](https://travis-ci.org/ovh/angular-a-disabled.svg)](https://travis-ci.org/ovh/angular-a-disabled)

## Example

```html
<div data-ng-controller="XdslModemResetCtrl as ResetCtrl">
    <button
        <!--
            data-ng-really-click: This parameter is required.
            `resetModem()` will be called if you accept the confimation message.
        -->
        data-ng-really-click="ResetCtrl.resetModem()"
        <!--
            data-ng-really-undo: This parameter is optional
            `undo()` will be called if you cancel the confimation message.
            data-ng-really-undo="ResetCtrl.undo()"
        -->
        data-ng-really-message="{{ 'xdsl_modem_reset_really' | translate }}"
        data-ng-really-confirm="{{ 'ok' | translate }}"
        data-ng-really-cancel="{{ 'cancel' | translate }}">
    </button>
</div>
```


# Installation

## Bower
    bower install ssh://git@github.com:ovh-ux/ovh-angular-a-disabled.git --save

## NPM

    npm install ssh://git@github.com:ovh-ux/ovh-angular-a-disabled.git --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-ui-confirm-modal.git
    cd ovh-angular-ui-confirm-modal
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

```

Include the module `ovh-angular-ui-confirm-modal` in your project and follow the example  below.
