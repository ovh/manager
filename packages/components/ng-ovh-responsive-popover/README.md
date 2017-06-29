# responsive-popover

![OVH component](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![NPM](https://nodei.co/npm/ovh-angular-responsive-popover.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-responsive-popover/)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh/ovh-angular-responsive-popover.svg)](https://travis-ci.org/ovh/ovh-angular-responsive-popover)

> `responsive-popover` module is used to display a popover and adapt it to the screen dimension.

 The two major directives are:
     - the `responsivePopover` directive that will display a uibPopover to the DOM element you instanciate it;
     - the `responsivePopoverClass` directive that is added to the popover popup.

 **Note:** when ui-bootstrap will be updated to version >= 2.0, it should be possible to remove `responsivePopover` directive and use uibPopover directive with custom class responsive-popover-class. So `responsivePopoverClass` directive will be the only directive of this component.

## Dependencies

- [matchmedia-ng](https://github.com/AnalogJ/matchmedia-ng)
- [ui.bootstrap](https://angular-ui.github.io/bootstrap)

# Installation

## Bower

    bower install ovh-angular-responsive-popover --save

## NPM

    npm install ovh-angular-responsive-popover --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-responsive-popover.git
    cd ovh-angular-responsive-popover
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-responsive-popover/blob/master/CONTRIBUTING.md)

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-responsive-popover/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-responsive-popover/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-responsive-popover


 Then inject responsivePopover module in your module declaration:
 ```
 angular.module("myModule", [
     ...
     "ovh-angular-responsive-popover",
     ...
 ]);
 ```

## Documentation

For a full documentation of the module, launch:

```
# grunt ngdocs && grunt connect
```

Then go on `http://localhost:9090`.

Or simply follow the md version of documentation:

### <a name="responsivePopover_directive_responsivePopover"></a>`responsivePopover` - directive

This is the main directive of the `responsivePopover` module. In fact it's an extended uibPopover with an additional class applied to it's content template.

 For available options, see the doc of [uibPopover](https://angular-ui.github.io/bootstrap/#/popover).

#### Example

  The following example will open a popover with the content of path/of/popover/content.html file inside. This popover will be closed when focus is lost inside of it.
 ```
 <button type="button"
         data-responsive-popover="'path/of/popover/content.html'"
         data-popover-placement="bottom-left"
         data-popover-trigger="focus">
 </button>
 ```

### <a name="responsivePopover_directive_responsivePopoverClass"></a>`responsivePopoverClass` - directive

This directive manage the way the popover is displayed. This uses the configuration setted into the `responsivePopoverProvider` to detect if the popover needs to be displayed on full screen or to be displayed normally.
 It is automatically setted by `responsivePopover` directive.

 **Note:** when ui-bootstrap version >= 2.0 will be used, the only thing to do should be to add a custom class with the 'popover-class' option of the uibPopover directive. To be tested.

### <a name="responsivePopover_responsivePopoverProvider"></a>`responsivePopoverProvider` - provider

* relates to the service : [responsivePopover](#responsivePopover_service_responsivePopover)

responsivePopoverProvider allows developper to configure which mediaQuery will be considered as a mobile.

#### Methods
##### setMobileMediaQuery
Allows you to determine what app will consider as a mobile for responsive popover display.

###### Parameters

| Param | Type | Details |
| ---- | ---- | ---- |
| query | String | The matchMedia query that will be used to detect mobile. |

###### Returns

| Type | Description |
| ---- | ---- |
| String | The new query provided. |

#### Example

  ```
    angular.module("myManagerApp").config(function (responsivePopoverProvider) {
         // tell to the module that we consider a mobile device with at least 800px width
         responsivePopoverProvider.setMobileMediaQuery("(max-width: 800px)");
     });
```

### <a name="responsivePopover_service_responsivePopover"></a>`responsivePopover` - service

* relates to the provider : [responsivePopoverProvider](#responsivePopover_responsivePopoverProvider)

This service enable you to get configured values.

#### Methods
##### getMobileMediaQuery
Get the current configured media query. It is used to detect the popover display (simple popover or full screen popover for mobile).

###### Returns

| Type | Description |
| ---- | ---- |
| String | The configured mediaQuery. |

# License

See https://github.com/ovh-ux/ovh-angular-responsive-popover/blob/master/LICENSE
