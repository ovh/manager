/**
 * @ngdoc overview
 *
 * @name actionsMenu
 *
 *  @requires [pascalprecht.translate](https://github.com/angular-translate/angular-translate)
 *  @requires [ovh-angular-responsive-popover](https://github.com/ovh-ux/ovh-angular-responsive-popover)
 *
 * @description
 * _An actions menu gives the opportunity to group a set of actions available for a specific context under a single menu._
 *
 * `actionMenu` module follows the UX specification of the [ovh actions menu guidelines](https://interne.ovh.net/confluence/display/UXGuidelines/Actions+menu).
 *
 *  ## TODO
 *
 *  - customizing page width ;
 *  - customizing open animation ;
 *  - actions with confirmation.
 */

(function () {
    "use strict";

    angular.module("ovh-angular-actions-menu", ["pascalprecht.translate", "ovh-angular-responsive-popover"]);
})();

/**
 *  @ngdoc directive
 *
 *  @name actionsMenu.directive:actionsMenuItem
 *
 *  @description
 *  This directive represent an item into an actions menu.
 *
 *  This directive is included by its parent directive: actionsMenu, and should not be called offside of the module scope.
 *  @param {ActionMenuItem} actions-menu-item An instance of ActionMenuItem.
 *  @param {Function} actions-menu-item-on-click A callback function called when the action menu item has been clicked.
 */
angular.module("ovh-angular-actions-menu").directive("actionsMenuItem", function () {
    "use strict";

    return {
        restrict: "A",
        templateUrl: "ovh-angular-actions-menu-item/ovh-angular-actions-menu-item.html",
        scope: {
            actionsMenuItem: "=actionsMenuItem",
            onClick: "&actionsMenuItemOnClick"
        },
        bindToController: true,
        controller: function () {
            // NOTHING HERE
        },
        controllerAs: "$ctrl"
    };
});

/**
 *  @ngdoc object
 *  @name actionsMenu.object:ActionsMenuItem
 *
 *  @description
 *  Factory that describe an item into an actions menu.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").controller("MyTestCtrl", function (ActionsMenuItem) {
 *          var actionMenuItem = new ActionsMenuItem({
 *              title: "My Beautiful title",
 *              icon: "filled-check",
 *              href: "http://www.google.be"
 *          });
 *      });
 *  </pre>
 *
 *  @constructor
 *  @param {Object} options Options for creating a new ActionsMenuItem instance.
 *  @param {String} [options.external=false] Is the link is an external link. In other words, will we be redirected offside of the manager ?
 *  @param {String} [options.href] The href to be redirected if item is clicked. Has no effect if state option is defined or subItems option is defined.
 *  @param {String} [options.icon] The icon class of the actions menu item icon.
 *  @param {String} [options.svg] SVG code escaped by using $sce.trustAsHtml method.
 *  @param {String} [options.state] The state to be redirected when item is clicked. Has no effect if href option is defined or subItems option is defined.
 *  @param {Object} [options.stateParams={}] The params to pass to the state.
 *  @param {Array<Object>} [options.subActions] Sub actions options to be added to the actions menu item. The options are the same of a first level item options.
    The actionsMenu directive only manage two levels of actions (only level one items with potentially sub actions).
 *  @param {String} [options.target=_self] The target of the href anchor tag. This will be the target html attribute.
 *  @param {String} [options.title] The title of the actions menu item.
 */
angular.module("ovh-angular-actions-menu").factory("ActionsMenuItem", function () {

    "use strict";

    /*= ==================================
    =            CONSTRUCTOR            =
    ===================================*/

    function ActionsMenuItem (options) {
        var self = this;

        this.title = options.title;

        if (options.svg) {
            this.svg = options.svg;
        } else if (options.icon) {
            this.icon = options.icon;
        }

        if (options.href && !options.state && !options.subItems) {
            this.href = options.href;
            this.target = options.target || "_self";
            this.external = options.external || false;
        } else if (options.state && !options.href && !options.subItems) {
            this.state = options.state;
            this.stateParams = options.stateParams || {};
        }

        this.subActions = [];
        if (options.subActions && options.subActions.length) {
            angular.forEach(options.subActions, function (subActionOptions) {
                self.addSubAction(subActionOptions);
            });
        }
    }

    /* -----  End of CONSTRUCTOR  ------*/

    /*= ========================================
    =            PROTOTYPE METHODS            =
    =========================================*/

    /**
     *  @ngdoc method
     *  @name actionsMenu.object:ActionsMenuItem#getFullSref
     *  @methodOf actionsMenu.object:ActionsMenuItem
     *
     *  @description
     *  Get the full sref string that will be applied to item that have state defined.
     *
     *  @returns {String} The string representation of a state. For example: my.manager.state({param1:1, param2:2}).
     */
    ActionsMenuItem.prototype.getFullSref = function () {
        var self = this;

        return self.state + "(" + JSON.stringify(self.stateParams) + ")";
    };

    /* ----------  SUB ITEMS  ----------*/

    /**
     *  @ngdoc method
     *  @name actionsMenu.object:ActionsMenuItem#addSubAction
     *  @methodOf actionsMenu.object:ActionsMenuItem
     *
     *  @description
     *  Add a sub action item to current actions menu item instance.
     *
     *  @param {Object} subActionOptions Options for creating an actions menu sub item. See constructor options for more details.
     *
     *  @returns {ActionsMenuItem} The new instance of actions menu item created.
     */
    ActionsMenuItem.prototype.addSubAction = function (subActionOptions) {
        var self = this;
        var subAction = new ActionsMenuItem(subActionOptions);

        self.subActions.push(subAction);

        return subAction;
    };

    /**
     *  @ngdoc method
     *  @name actionsMenu.object:ActionsMenuItem#hasSubActions
     *  @methodOf actionsMenu.object:ActionsMenuItem
     *
     *  @description
     *  Check if the instance of actions menu item has sub actions defined.
     *
     *  @returns {Boolean} true if item has subItems, false otherwise.
     */
    ActionsMenuItem.prototype.hasSubActions = function () {
        var self = this;

        return self.subActions.length;
    };

    /* -----  End of PROTOTYPE METHODS  ------*/

    return ActionsMenuItem;

});

angular.module("ovh-angular-actions-menu").controller("ActionsMenuCtrl", ["actionsMenu", "ActionsMenu", function (actionsMenu, ActionsMenu) {
    "use strict";

    var self = this;

    self.actionsMenu = null;
    self.activeActionItem = null;
    self.onPageSwitch = angular.noop; // will be overrided into directive link function and will manage focus

    self.loading = {
        init: false
    };

    self.status = {
        move: false
    };

    /*= =============================
    =            EVENTS            =
    ==============================*/

    self.onItemClick = function (actionItem) {
        if (actionItem.hasSubActions()) {
            self.status.move = true;
            self.activeActionItem = actionItem;
            self.onPageSwitch();
        } else {
            self.popoverSettings.isOpen = false;
        }

        return true;
    };

    self.onBackButtonClick = function () {
        self.status.move = false;
        self.onPageSwitch();

        return true;
    };

    /* -----  End of EVENTS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    self.$onInit = function () {
        self.loading.init = true;

        // build action menu object
        self.actionsMenu = new ActionsMenu({
            actionsMenuItems: self.actionsOptions
        });

        // load translations
        return actionsMenu.loadTranslations().finally(function () {
            self.loading.init = false;
        });
    };

    /* -----  End of INITIALIZATION  ------*/

}]);

/**
 *  @ngdoc directive
 *
 *  @name actionsMenu.directive:actionsMenu
 *
 *  @description
 *  This is the main directive of the module. It's creating a popover with desired actions inside.
 *
 *  @param {Object[]} actions-menu-options A list of actions options that will be displayed into actionsMenu. See ActionsMenu factory and ActionsMenuItem factory for available options.
 *  @param {Object} actions-menu-popover-settings A list of options of the popover. For now only : class, placement, trigger and isOpen options are supported. Feel free to add others!!!
 See [ui.bootstrap.popover](https://angular-ui.github.io/bootstrap/#/popover) for more informations.
 *
 *  @example
 *  The following example will open an actions popover with 2 actions inside it:
 *
 *  In your controller:
 *
 *  <pre>
 *  angular.module("myManagerModule").controller("myTestController", function ($scope) {
 *      $scope.popoverSettings = {
 *          "popover-class": "my-custom-class",
 *          "popover-placement": "bottom-right"
 *      };
 *
 *      $scope.actionsOptions = [{
 *          title: "My Beautiful title",
 *          icon: "filled-check",
 *          href: "http://www.google.be"
 *      }, {
 *          title: "My Other title",
 *          icon: "filled-error",
 *          state: "my-manager.state1"
 *      }];
 *  });
 *  </pre>
 *
 *  And in your html view:
 *
 *  <pre>
 *  <actions-menu data-actions-menu-options="actionsOptions"
 *                data-actions-menu-popover-settings="popoverSettings">
 *      <i class="my-font my-font-actions"></i>
 *      Button actions
 *  </actions-menu>
 *  </pre>
 */
angular.module("ovh-angular-actions-menu").directive("actionsMenu", function () {
    "use strict";

    return {
        restrict: "E",
        transclude: true,
        templateUrl: "ovh-angular-actions-menu.html",
        scope: {
            actionsOptions: "=actionsMenuOptions",
            popoverSettings: "=actionsMenuPopoverSettings"
        },
        controller: "ActionsMenuCtrl",
        controllerAs: "$ctrl",
        bindToController: true,
        link: function (scope, tElement, attributs, actionsMenuCtrl) {

            /**
             *  Close actions menu popover
             */
            var closeActionsMenu = function () {
                actionsMenuCtrl.popoverSettings.isOpen = false;
                scope.$apply();
            };

            /**
             *  Watch isOpen state to force left page to be displayed in case of reopening actions menu
             */
            scope.$watch("$ctrl.popoverSettings.isOpen", function (isNowOpen, wasOpen) {
                if (wasOpen && !isNowOpen) {
                    actionsMenuCtrl.status.move = false;
                } else if (isNowOpen && !wasOpen) {
                    actionsMenuCtrl.onPageSwitch();
                }
            });

            /**
             *  Manage escape event on actions button element
             */
            tElement.find("button.actions-menu-button").on("keydown", function (event) {
                if (event.keyCode === 27) {
                    closeActionsMenu();
                }
            });

            /**
             *  Manage focus state. Shared with controller to allow focus management into controller events.
             */
            actionsMenuCtrl.onPageSwitch = function () {
                // get visible page dom element
                var visiblePage = tElement.find(actionsMenuCtrl.status.move ? "div.secondary-page" : "div.main-page");

                // insert a invisible link to it for a better focus management
                var focusHelper = visiblePage.find("a.focus-helper");
                if (!focusHelper.length) {
                    focusHelper = $("<a></a>");
                    focusHelper.attr({
                        href: "#",
                        "class": "focus-helper",
                        onClick: "return false;"
                    });
                    visiblePage.append(focusHelper);
                }

                // set focus to invisble element
                focusHelper.focus();

                // manage focus loop for current page
                visiblePage.on("keydown", function (event) {
                    if (event.keyCode === 9) { // tab
                        if (event.shiftKey) { // shift+tab
                            if ($(event.target).is(visiblePage.find("a:not(.focus-helper), button").first())) {
                                visiblePage.find("a:not(.focus-helper), button").last().focus();
                                event.preventDefault();
                            }
                        } else if ($(event.target).is(visiblePage.find("a:not(.focus-helper), button").last()) || $(event.target).is(focusHelper)) {
                            visiblePage.find("a:not(.focus-helper), button").first().focus();
                            event.preventDefault();
                        }
                    } else if (event.keyCode === 27) { // esc
                        closeActionsMenu();
                    }
                });
            };

        }
    };
});

/**
 *  @ngdoc object
 *  @name actionsMenu.object:ActionsMenu
 *
 *  @requires ActionsMenuItem
 *
 *  @description
 *  Factory that describe an actions menu.
 *
 *  A new instance of ActionsMenu is created and used by the actionsMenu directive.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").controller("MyTestCtrl", function (ActionsMenu) {
 *          var actionMenu = new ActionsMenu({
 *              actionsMenuItems: [{
 *                  title: "My Beautiful title",
 *                  icon: "filled-check",
 *                  href: "http://www.google.be"
 *              }]
 *          });
 *      });
 *  </pre>
 *
 *  @constructor
 *  @param {Object} options Options for creating a new ActionsMenu instance.
 *  @param {Array<Object>} [options.actionsMenuItems=Empty Array] The options of the items that will be added to the ActionsMenu instance.
 */
angular.module("ovh-angular-actions-menu").factory("ActionsMenu", ["ActionsMenuItem", function (ActionsMenuItem) {

    "use strict";

    /*= ==================================
    =            CONSTRUCTOR            =
    ===================================*/

    function ActionsMenu (options) {
        var self = this;

        this.actions = [];

        if (options.actionsMenuItems && options.actionsMenuItems.length) {
            angular.forEach(options.actionsMenuItems, function (actionMenuItemOptions) {
                self.addActionItem(actionMenuItemOptions);
            });
        }
    }

    /* -----  End of CONSTRUCTOR  ------*/

    /*= ========================================
    =            PROTOTYPE METHODS            =
    =========================================*/

    /* ----------  ACTIONS MENU ITEMS  ----------*/

    /**
     *  @ngdoc method
     *  @name actionsMenu.object:ActionsMenu#addActionItem
     *  @methodOf actionsMenu.object:ActionsMenu
     *
     *  @description
     *  Add an actions menu item into actions list.
     *
     *  @param {Object} actionMenuItemOptions The options for creating a new action menu item. See ActionsMenuItem factory for available options.
     *
     *  @returns {ActionsMenuItem} The added actions menu item.
     */
    ActionsMenu.prototype.addActionItem = function (actionMenuItemOptions) {
        var self = this;
        var newActionItem = new ActionsMenuItem(actionMenuItemOptions);

        self.actions.push(newActionItem);

        return newActionItem;
    };

    /* -----  End of PROTOTYPE METHODS  ------*/

    return ActionsMenu;

}]);

/**
 * @ngdoc service
 * @name actionsMenu.actionsMenuProvider
 *
 * @description
 * actionsMenuProvider allows developper to configure the path of the translation file.
 *
 * @example
 * <pre>
 *     angular.module("myManagerApp").config(function (actionsMenuProvider) {
 *          // set a new path for translations of the module
 *          actionsMenuProvider.setTranslationPath("/the/new/translation/path");
 *      });
 * </pre>
 */
angular.module("ovh-angular-actions-menu").provider("actionsMenu", function () {

    "use strict";

    var self = this;
    var translationPath = "../bower_components/ovh-angular-actions-menu/dist/ovh-angular-actions-menu";

    /*= ====================================
    =            CONFIGURATION            =
    =====================================*/

    /**
     *  @ngdoc method
     *  @name actionsMenu.actionsMenuProvider#setTranslationPath
     *  @methodOf actionsMenu.actionsMenuProvider
     *
     *  @description
     *  Allows you to change the default location of the translation file of the module.
     *
     *  @param {String} path The new path of the translation file.
     *
     *  @return {String} The new configured translation path.
     */
    self.setTranslationPath = function (path) {
        if (path) {
            translationPath = path;
        }

        return translationPath;
    };

    /* -----  End of CONFIGURATION  ------*/

    /**
     *  @ngdoc service
     *  @name actionsMenu.service:actionsMenu
     *
     *  @description
     *  This service enable you to load translation file.
     */
    self.$get = ["$translate", "$translatePartialLoader", function ($translate, $translatePartialLoader) {
        return {
            /**
             *  @ngdoc method
             *  @name actionsMenu.service:actionsMenu#
             *  @methodOf actionsMenu.service:actionsMenu
             *
             *  @description
             *  Load the translation file from the configured path.
             *
             *  @return {Promise} When the translation file is loaded.
             */
            loadTranslations: function () {
                $translatePartialLoader.addPart(translationPath);
                return $translate.refresh();
            }
        };
    }];

});

angular.module('ovh-angular-actions-menu').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-actions-menu-inner.html',
    "<div class=actions-menu-inner><!-- CLOSE BUTTON FOR MOBILE --> <button class=\"close-button visible-xs-block visible-sm-block no-style\" type=button data-ng-click=\"$ctrl.popoverSettings.isOpen = false\"><i class=\"ovh-font ovh-font-wrong bold\"></i></button><!-- CLOSE BUTTON FOR MOBILE --><div class=actions-menu-pages data-ng-class=\"{ move: $ctrl.status.move }\"><div class=\"actions-menu-page main-page\"><ul class=\"actions-list list-unstyled no-space\"><li class=actions-list-item data-ng-repeat=\"menuAction in $ctrl.actionsMenu.actions track by $index\" data-actions-menu-item=menuAction data-actions-menu-item-on-click=$ctrl.onItemClick></li></ul></div><div class=\"actions-menu-page secondary-page\"><ul class=\"sub-actions-list list-unstyled no-space\"><li class=actions-list-item><button class=\"back-btn no-style\" type=button data-ng-click=$ctrl.onBackButtonClick()><i class=\"ovh-font ovh-font-arrow-left right-space-m8\"></i> <span class=bold data-translate=actions_menu_back_btn></span></button></li><li class=actions-list-item data-ng-repeat=\"menuAction in $ctrl.activeActionItem.subActions track by $index\" data-actions-menu-item=menuAction data-actions-menu-item-on-click=$ctrl.onItemClick></li></ul></div></div></div>"
  );


  $templateCache.put('ovh-angular-actions-menu-item/ovh-angular-actions-menu-item.html',
    "<a class=\"actions-menu-item-link block full-width\" data-ng-href=\"{{ $ctrl.actionsMenuItem.href }}\" target=\"{{ $ctrl.actionsMenuItem.target }}\" data-ng-if=$ctrl.actionsMenuItem.href data-ng-click=$ctrl.onClick()($ctrl.actionsMenuItem)><span class=\"inline-block item-icon\" data-ng-if=$ctrl.actionsMenuItem.icon><i class=ovh-font data-ng-class=\"'ovh-font-{{ $ctrl.actionsMenuItem.icon }}'\" aria-hidden></i> </span><span class=\"inline-block item-icon\" data-ng-if=$ctrl.actionsMenuItem.svg data-ng-bind-html=$ctrl.actionsMenuItem.svg></span> <span class=\"block item-title\"><span class=item-title-text data-ng-bind=$ctrl.actionsMenuItem.title></span> <span class=external-link data-ng-if=$ctrl.actionsMenuItem.external><i class=\"ovh-font ovh-font-newtab\"></i> </span></span></a><a class=\"actions-menu-item-link block full-width\" data-ui-sref=\"{{ $ctrl.actionsMenuItem.getFullSref() }}\" data-ng-if=$ctrl.actionsMenuItem.state data-ng-click=$ctrl.onClick()($ctrl.actionsMenuItem)><span class=\"inline-block item-icon\" data-ng-if=$ctrl.actionsMenuItem.icon aria-hidden><i class=ovh-font data-ng-class=\"'ovh-font-{{ $ctrl.actionsMenuItem.icon }}'\" aria-hidden></i> </span><span class=\"block item-title\" data-ng-bind=$ctrl.actionsMenuItem.title></span> </a><button class=\"actions-menu-item-link no-style block full-width\" type=button data-ng-if=$ctrl.actionsMenuItem.hasSubActions() data-ng-click=$ctrl.onClick()($ctrl.actionsMenuItem)><span class=\"inline-block item-icon\" data-ng-if=$ctrl.actionsMenuItem.icon aria-hidden><i class=ovh-font data-ng-class=\"'ovh-font-{{ $ctrl.actionsMenuItem.icon }}'\" aria-hidden></i> </span><span class=\"inline-block item-icon\" data-ng-if=$ctrl.actionsMenuItem.svg data-ng-bind-html=$ctrl.actionsMenuItem.svg></span> <span class=\"block item-title\" data-ng-bind=$ctrl.actionsMenuItem.title></span></button>"
  );


  $templateCache.put('ovh-angular-actions-menu.html',
    "<button type=button class=actions-menu-button data-ng-class=\"{ 'menu-open' : $ctrl.popoverSettings.isOpen }\" data-responsive-popover=\"'ovh-angular-actions-menu-inner.html'\" data-popover-class=\"{{ $ctrl.popoverSettings.class ? $ctrl.popoverSettings.class + ' ovh-angular-actions-menu' : 'ovh-angular-actions-menu' }}\" data-popover-placement=\"{{ $ctrl.popoverSettings.placement }}\" data-popover-trigger=\"{{ $ctrl.popoverSettings.trigger }}\" data-popover-is-open=$ctrl.popoverSettings.isOpen data-ng-transclude></button>"
  );

}]);
