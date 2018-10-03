# Sidebar Menu

![OVH component](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![NPM](https://nodei.co/npm/ovh-angular-sidebar-menu.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-sidebar-menu/)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh/ovh-angular-sidebar-menu.svg)](https://travis-ci.org/ovh/ovh-angular-sidebar-menu)

Manage and display a left menu tree. This is the main module which holds everything together!

## Dependencies
- [ng-slide-down](https://github.com/TheRusskiy/ng-slide-down)

## TODO

- custom styles on scroll bar ;
- virtual scroll ;
- search into sections ;
- display show all button when more than 10 items.

## Installation

## Bower

    bower install ovh-angular-sidebar-menu --save

## NPM

    npm install ovh-angular-sidebar-menu --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-sidebar-menu.git
    cd ovh-angular-sidebar-menu
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-sidebar-menu/blob/master/CONTRIBUTING.md)

### Usage

In your web page:

```html
<script src="angular.js"></script>
<script src="dist/sidebar-menu.min.js"></script>
...
<body>
...
    <div data-sidebar-menu></div>
...
</body>
```

In your main app.js file:

```javascript
angular.module("myManagerModule", [
    ...
    "ovh-angular-sidebar-menu"
    ...
]);
```

During angular run phase, add ``ovh-angular-sidebar-menu`` service as dependency and add "root" items to manager sidebar menu:

```javascript
angular.module("myManagerModule").run(function ($translate, sidebarMenu, myResourceService) {
    var self = this;

    self.mainSectionItem = null;

    function myFunctionThatReturnAPromise () {
        return myResourceService.v6().query().$promise.then(function (datas) {
            angular.forEach(datas, function (data) {
                SidebarMenu.addMenuItem({
                    title: data.description || data.serviceName,
                    id: data.serviceName,
                    state: "mymanager.state.subState",
                    stateParams: {
                        foo : "test",
                        test : "foo"
                    }
                }, self.mainSectionItem);
            });
        });
    }

    // wait that sidebar is loaded (wait that translations are loaded)
    SidebarMenu.loadDeferred.promise.then(function () {
        // creating a level 1 item
        self.mainSectionItem = SidebarMenu.addMenuItem({
            title: $translate.instant("translation_key"),
            category: "my-category",
            icon: "myOvhFontIconName",
            allowSubItems: true,
            onLoad: myFunctionThatReturnAPromise,
            loadOnState: "mymanager.state"
        });

        // confugure order menu items
        SidebarMenu.addActionsMenuOptions([{
            id: "order1",
            title: $translate.instant("order_translation_key1"),
            icon: "myOvhFontIconName1",
            href: "https://www.ovh.com/",
            target: "_blank"
        }, {
            id: "order2",
            title: $translate.instant("order_translation_key2"),
            icon: "myOvhFontIconName2",
            href: "#/my-order/dest"
        }, {
            id: "order3",
            title: $translate.instant("order_translation_key3"),
            icon: "myOvhFontIconName3",
            href: "#/my-order/dest2"
        }]);

        // Add Action menu iten click handler
        SidebarMenu.addActionsMenuItemClickHandler(function (id) {
            console.log("Actions menu item " + id + " has been selected!");
        });
    });
});
```

This code will add an item into manager sidebar menu and when current state will be "mymanager.state" or when it will be clicked, it will load sub items.

### Using with less

Some vars can be configured in manager app less part under #sidebar-menu namespace. They have all default values.

* ```@SIDEBAR_MENU_OFFSET_TOP``` : top position of the sidebar
* ```@SIDEBAR_MENU_Z_INDEX``` : z-index of the sidebar
* ```@SIDEBAR_MENU_OPACITY``` : opacity of elements that need opacity in the sidebar
* ```@SIDEBAR_MENU_ACTIVE_COLOR``` : active color of items (should be set to @UNIVERS)
* ```@SIDEBAR_MENU_COLOR``` : items text color
* ```@SIDEBAR_MENU_BG_COLOR``` : background color of the sidebar element
* ```@SIDEBAR_MENU_ACTIVE_ITEM_BG_COLOR```       : background color of the active item
* ```@SIDEBAR_MENU_LVL1_ACTIVE_BORDER_COLOR```   : border color of the sub items of the active item of level 1
* ```@SIDEBAR_MENU_LVL2_ACTIVE_BORDER_COLOR```   : border color of the sub items of the active item of level 2
* ```@SIDEBAR_MENU_MOBILE_TOP_NAV_HEIGHT```      : height of the manager top nav element. Needed to adjust position of sidebar menu on mobile
* ```@SIDEBAR_MENU_LVL1_FONT_SIZE```             : font side of items of level 1
* ```@SIDEBAR_MENU_LVL2_FONT_SIZE```             : font side of items of level 2 (and sub levels)

## Development

To start developping on this module, launch:

```
# make install
```

This will install npm and bower dependencies. Then launch:

```
# grunt watch
```

And start developing.

**Note:** if you add a new feature to module, don't forget to document your new piece of code.

## Documentation

For a full documentation of the module, launch:

```
# grunt ngdocs && grunt connect
```

Then go on `http://localhost:9090`.

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-sidebar-menu/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-sidebar-menu/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-sidebar-menu

# License

See https://github.com/ovh-ux/ovh-angular-sidebar-menu/blob/master/LICENSE
