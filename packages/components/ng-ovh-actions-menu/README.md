
# ovh-angular-actions-menu

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-actions-menu.svg)](https://travis-ci.org/ovh-ux/ovh-angular-actions-menu)

[![NPM](https://nodei.co/npm/ovh-angular-actions-menu.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-actions-menu/)

> An actions menu gives the opportunity to group a set of actions available for a specific context under a single menu.

`ovh-angular-actions-menu` module follows the UX specification

## Dependencies

- [pascalprecht.translate](https://github.com/angular-translate/angular-translate)
- [responsivePopover](https://github.com/ovh-ux/ovh-angular-responsive-popover)

## Installation

## Bower

    bower install ovh-angular-actions-menu --save

## NPM

    npm install ovh-angular-actions-menu --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-actions-menu.git
    cd ovh-angular-actions-menu
    npm install
    bower install
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-actions-menu/blob/master/CONTRIBUTING.md)

 Then inject actionsMenu module in your module declaration:
 ```javascript
 angular.module("myModule", [
     ...
     "ovh-angular-actions-menu",
     ...
 ]);
 ```

 ## TODO

 - customizing page width ;
 - customizing open animation ;
 - actions with confirmation.

## Documentation

For a full documentation of the module, launch:

```
# grunt ngdocs && grunt connect
```

Then go on `http://localhost:9090`.

Or simply follow the md version of documentation:

### <a name="actionsMenu_directive_actionsMenu"></a>`actionsMenu` - directive

This is the main directive of the module. It's creating a popover with desired actions inside.

### Arguments

| Param | Type | Details |
| ---- | ---- | ---- |
| ovh-angular-actions-menu-options | Object[] | A list of actions options that will be displayed into actionsMenu. See ActionsMenu factory and ActionsMenuItem factory for available options. |
| ovh-angular-actions-menu-popover-settings | Object | A list of options of the popover. For now only : class, placement, trigger and isOpen options are supported. Feel free to add others!!! See [ui.bootstrap.popover](https://angular-ui.github.io/bootstrap/#/popover) for more informations. |

#### Example

  The following example will open an actions popover with 2 actions inside it:

 In your controller:

 ```javascript
 angular.module("myManagerModule").controller("myTestController", function ($scope) {
     $scope.popoverSettings = {
         "popover-class": "my-custom-class",
         "popover-placement": "bottom-right"
     };

     $scope.actionsOptions = [{
         title: "My Beautiful title",
         icon: "filled-check",
         href: "http://www.google.be"
     }, {
         title: "My Other title",
         icon: "filled-error",
         state: "my-manager.state1"
     }];
 });
 ```

 And in your html view:

 ```html
 <actions-menu data-ovh-angular-actions-menu-options="actionsOptions"
               data-ovh-angular-actions-menu-popover-settings="popoverSettings">
     <i class="my-font my-font-actions"></i>
     Button actions
 </actions-menu>
 ```

### <a name="actionsMenu_directive_actionsMenuItem"></a>`actionsMenuItem` - directive

This directive represent an item into an actions menu.

 This directive is included by its parent directive: actionsMenu, and should not be called offside of the module scope.

### Arguments

| Param | Type | Details |
| ---- | ---- | ---- |
| ovh-angular-actions-menu-item | ActionMenuItem | An instance of ActionMenuItem. |
| ovh-angular-actions-menu-item-on-click | Function | A callback function called when the action menu item has been clicked. |

### <a name="actionsMenu_object_ActionsMenu"></a>`ActionsMenu` - object

Factory that describe an actions menu.

 A new instance of ActionsMenu is created and used by the actionsMenu directive.

## Dependencies

* ActionsMenuItem

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-actions-menu/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-actions-menu/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-actions-menu

# License

See https://github.com/ovh-ux/ovh-angular-actions-menu/blob/master/LICENSE


### Arguments

| Param | Type | Details |
| ---- | ---- | ---- |
| options | Object | Options for creating a new ActionsMenu instance. |
| options.actionsMenuItems | Array<Object> | The options of the items that will be added to the ActionsMenu instance. |

#### Methods
##### addActionItem
Add an actions menu item into actions list.

###### Parameters

| Param | Type | Details |
| ---- | ---- | ---- |
| actionMenuItemOptions | Object | The options for creating a new action menu item. See ActionsMenuItem factory for available options. |

###### Returns

| Type | Description |
| ---- | ---- |
| ActionsMenuItem | The added actions menu item. |

#### Example

  ```javascript
     angular.module("myManagerApp").controller("MyTestCtrl", function (ActionsMenu) {
         var actionMenu = new ActionsMenu({
             actionsMenuItems: [{
                 title: "My Beautiful title",
                 icon: "filled-check",
                 href: "http://www.google.be"
             }]
         });
     });
 ```

### <a name="actionsMenu_object_ActionsMenuItem"></a>`ActionsMenuItem` - object

Factory that describe an item into an actions menu.

### Arguments

| Param | Type | Details |
| ---- | ---- | ---- |
| options | Object | Options for creating a new ActionsMenuItem instance. |
| options.external | String | Is the link is an external link. In other words, will we be redirected offside of the manager ? |
| options.href | String | The href to be redirected if item is clicked. Has no effect if state option is defined or subItems option is defined. |
| options.icon | String | The icon class of the actions menu item icon. |
| options.state | String | The state to be redirected when item is clicked. Has no effect if href option is defined or subItems option is defined. |
| options.stateParams | Object | The params to pass to the state. |
| options.subActions | Array<Object> | Sub actions options to be added to the actions menu item. The options are the same of a first level item options. The actionsMenu directive only manage two levels of actions (only level one items with potentially sub actions). |
| options.target | String | The target of the href anchor tag. This will be the target html attribute. |
| options.title | String | The title of the actions menu item. |

#### Methods
##### getFullSref
Get the full sref string that will be applied to item that have state defined.

###### Returns

| Type | Description |
| ---- | ---- |
| String | The string representation of a state. For example: my.manager.state({param1:1, param2:2}). |

##### addSubAction
Add a sub action item to current actions menu item instance.

###### Parameters

| Param | Type | Details |
| ---- | ---- | ---- |
| subActionOptions | Object | Options for creating an actions menu sub item. See constructor options for more details. |

###### Returns

| Type | Description |
| ---- | ---- |
| ActionsMenuItem | The new instance of actions menu item created. |

##### hasSubActions
Check if the instance of actions menu item has sub actions defined.

###### Returns

| Type | Description |
| ---- | ---- |
| Boolean | true if item has subItems, false otherwise. |

#### Example

  ```javascript
     angular.module("myManagerApp").controller("MyTestCtrl", function (ActionsMenuItem) {
         var actionMenuItem = new ActionsMenuItem({
             title: "My Beautiful title",
             icon: "filled-check",
             href: "http://www.google.be"
         });
     });
 ```

### <a name="actionsMenu_actionsMenuProvider"></a>`actionsMenuProvider` - provider

* relates to the service : [actionsMenu](#actionsMenu_service_actionsMenu)

actionsMenuProvider allows developper to configure the path of the translation file.

#### Methods
##### setTranslationPath
Allows you to change the default location of the translation file of the module.

###### Parameters

| Param | Type | Details |
| ---- | ---- | ---- |
| path | String | The new path of the translation file. |

###### Returns

| Type | Description |
| ---- | ---- |
| String | The new configured translation path. |

#### Example

  ```javascript
    angular.module("myManagerApp").config(function (actionsMenuProvider) {
         // set a new path for translations of the module
         actionsMenuProvider.setTranslationPath("/the/new/translation/path");
     });
```

### <a name="actionsMenu_service_actionsMenu"></a>`actionsMenu` - service

* relates to the provider : [actionsMenuProvider](#actionsMenu_actionsMenuProvider)

This service enable you to load translation file.

#### Methods
#####
Load the translation file from the configured path.

###### Returns

| Type | Description |
| ---- | ---- |
| Promise | When the translation file is loaded. |
