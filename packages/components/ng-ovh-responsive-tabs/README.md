# ovh-angular-responsive-tabs with angular-ui

![OVH component](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![NPM](https://nodei.co/npm/ovh-angular-responsive-tabs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-responsive-tabs/)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh/ovh-angular-responsive-tabs.svg)](https://travis-ci.org/ovh/ovh-angular-responsive-tabs)

> Wrapper for Angular UI Bootstrap directive "Tabs", that works with Angular UI Router.

Dynamically calculate the size of the tabs and push it into a dropdown.

# Installation

## Bower

    bower install ovh-angular-responsive-tabs --save

## NPM

    npm install ovh-angular-responsive-tabs --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-responsive-tabs.git
    cd ovh-angular-responsive-tabs
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-responsive-tabs/blob/master/CONTRIBUTING.md)

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-responsive-tabs/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-responsive-tabs/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-responsive-tabs

# License

See https://github.com/ovh-ux/ovh-angular-responsive-tabs/blob/master/LICENSE

## Requirements
  - `jQuery`
  - `ui.router`
  - `ui.bootstrap`


## Usage

There are 3 directives:

### ovh-angular-responsive-tabs
The container which contains the tabs.

Options:
  * `justified` _(optional)_ : Justify align the tabs _(NOT TESTED)_
  * `vertical`  _(optional)_ : Verticaly align the tabs _(NOT TESTED)_
  * `immovable` _(optional)_ : If true, prevent the directive to always display the active tab.


### responsive-tab
A regular tab.

Options:
  * `disabled`              _(optional)_ : Tab is disabled? (true/false)
  * `select`                _(optional)_ : Function called on select
  * `dropdown`              _(optional)_ : Add this if the tab is an angular-ui dropdown
  * `state`                 _(optional)_ : ui.router state
  * `stateParams`           _(optional)_ : ui.router params
  * `stateOptions`          _(optional)_ : ui.router options
  * `dropdownTitle`         _(optional)_ : (text) Text for this tab in the "more tab" dropdown
  * `dropdownTitleTemplate` _(optional)_ : (url) Text for this tab in the "more tab" dropdown

### ovh-angular-responsive-tabs
*MANDATORY* The "more" tab dropdown (should be the last)

## Example

```html
<div class="row">
    <div class="col-xs-12">
        <responsive-tabs>
            <responsive-tab state="main.one">Home</responsive-tab>
            <responsive-tab state="main.two" dropdown-title="Chhh...">
                <i class="fa fa-user-secret"></i>
                <span>Hub</span>
            </responsive-tab>
            <responsive-tab-more> <i class="fa fa-plus"></i> </responsive-tab-more>  <!-- Should always be the last -->
        </responsive-tabs>
    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        <ui-view></ui-view>
    </div>
</div>
```
```javascript
.config(function ($stateProvider) {
    $stateProvider
      .state("main", {
        url : '/main',
        templateUrl: "app/main/main.html",
        controller: "mainCtrl",
        controllerAs : "mainCtrl"
      }).state('main.one', {
        url:         '/one',
        templateUrl: 'app/main/one.html'
      }).state('main.two', {
        url:         '/two',
        templateUrl: 'app/main/two.html'
      })
```
