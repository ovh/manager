# ng-ovh-responsive-popover

> AngularJS module used to display a popover and adapt it to the screen dimension.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-responsive-popover)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-responsive-popover) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-responsive-popover)](https://npmjs.com/package/@ovh-ux/ng-ovh-responsive-popover) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-responsive-popover)](https://npmjs.com/package/@ovh-ux/ng-ovh-responsive-popover?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-responsive-popover)](https://npmjs.com/package/@ovh-ux/ng-ovh-responsive-popover?activeTab=dependencies)

## Install

```sh
$ pnpm install @ovh-ux/ng-ovh-responsive-popover
```

## Usage

```js
import angular from 'angular';
import ngOvhResponsivePopover from '@ovh-ux/ng-ovh-responsive-popover';

angular.module('myApp', [ngOvhResponsivePopover]);
```

The two major directives are:
- the `responsivePopover` directive that will display a uibPopover to the DOM element you instanciate it;
- the `responsivePopoverClass` directive that is added to the popover popup.

**Note:** when ui-bootstrap will be updated to version >= 2.0, it should be possible to remove `responsivePopover` directive and use uibPopover directive with custom class responsive-popover-class. So `responsivePopoverClass` directive will be the only directive of this component.

Then inject responsivePopover module in your module declaration:

## Documentation

### <a name="responsivePopover_directive_responsivePopover"></a>`responsivePopover` - directive

This is the main directive of the `responsivePopover` module. In fact it's an extended uibPopover with an additional class applied to it's content template.

For available options, see the doc of [uibPopover](https://angular-ui.github.io/bootstrap/#/popover).

#### Example

The following example will open a popover with the content of path/of/popover/content.html file inside. This popover will be closed when focus is lost inside of it.

```html
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

responsivePopoverProvider allows developer to configure which mediaQuery will be considered as a mobile.

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

```js
import angular from 'angular';

angular.module('myApp').config(
  /* @ngInject */ (responsivePopoverProvider) => {
    // tell to the module that we consider a mobile device with at least 800px width
    responsivePopoverProvider.setMobileMediaQuery('(max-width: 800px)');
  },
);
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

## Test

```sh
$ pnpm test
```

## Related

- [matchmedia-ng](https://github.com/AnalogJ/matchmedia-ng)
- [ui.bootstrap](https://angular-ui.github.io/bootstrap)

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
