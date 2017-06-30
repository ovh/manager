/**
 * @ngdoc object
 * @name sidebarMenu.SidebarMenuProvider
 *
 * @description
 * sidebarMenuProvider allows developper to configure :
 *     - extra translations that need to be loaded ;
 *     - the template path of the inner content of sidebar menu itemms.
 *
 * @example
 * <pre>
 *     angular.module("myManagerApp").config(function (SidebarMenuProvider) {
 *          // add translation path
 *          SidebarMenuProvider.addTranslationPath("../components/sidebar");
 *          // configure the inner item content html file
 *          SidebarMenuProvider.setInnerMenuItemTemplatePath("../components/my-dangerous-and-risky-configuration.html");
 *      });
 * </pre>
 */

angular.module("ovh-angular-sidebar-menu").provider("SidebarMenu", function () {
    "use strict";

    var self = this;

    var translationPaths = ["../bower_components/sidebar-menu/dist/sidebar-menu"];
    var innerMenuItemTemplatePath = "sidebar-menu-list/sidebar-menu-list-item/sidebar-menu-list-item-inner.html";
    var minItemsForEnablingSearch = 10;

    /*= ====================================
    =            CONFIGURATION            =
    =====================================*/

    /* ----------  TRANSLATION  ----------*/

    /**
     *  @ngdoc function
     *  @name sidebarMenu.SidebarMenuProvider#addTranslationPath
     *  @methodOf sidebarMenu.SidebarMenuProvider
     *
     *  @description
     *  Allows you to add an extra translations path when manager sidebar is loading.
     *
     *  @param {String} translationPath The translations file path to add.
     *
     *  @return {Array} The list of translations to load.
     */
    self.addTranslationPath = function (translationPath) {
        if (translationPath) {
            translationPaths.push(translationPath);
        }

        return translationPaths;
    };

    /* ----------  INNER MENU ITEM TEMPLATE  ----------*/

    /**
     *  @ngdoc function
     *  @name sidebarMenu.SidebarMenuProvider#setInnerMenuItemTemplatePath
     *  @methodOf sidebarMenu.SidebarMenuProvider
     *
     *  @description
     *  Configure the inner menu item template path. This will load your specific inner content instead of the default one. Use it at your own risk.
     *
     *  @param {String} templatePath The path of the inner content html file
     *
     *  @return {String} The newest html file path
     */
    self.setInnerMenuItemTemplatePath = function (templatePath) {
        if (templatePath) {
            innerMenuItemTemplatePath = templatePath;
        }
        return innerMenuItemTemplatePath;
    };

    /**
     *  @ngdoc function
     *  @name sidebarMenu.SidebarMenuProvider#setMinItemsForEnablingSearch
     *  @methodOf sidebarMenu.SidebarMenuProvider
     *
     *  @description
     *  Configure the minimum items length for enabling search. By default the min items is set to 10.
     *
     *  @param {Number} minItems The new value for enabling search.
     *
     *  @return {Number} The new value setted.
     */
    self.setMinItemsForEnablingSearch = function (minItems) {
        if (_.isNumber(minItems)) {
            minItemsForEnablingSearch = minItems;
        }

        return minItemsForEnablingSearch;
    };

    /* -----  End of CONFIGURATION  ------*/

    self.$get = function ($q, $timeout, $state, $translate, $translatePartialLoader, SidebarMenuListItem) {

        /**
         *  @ngdoc service
         *  @name sidebarMenu.service:SidebarMenu
         *
         *  @requires $q
         *  @requires $timeout
         *  @requires $state
         *  @requires $translate
         *  @requires $translatePartialLoader
         *  @requires SidebarMenuListItem
         *
         *  @description
         *  The `SidebarMenu` service is actual core of sidebarMenu module. This service manage the content of the sidebar menu and the different state (active, open, ...) of its items.
         */
        var sidebarMenuService = {
            items: [],
            actionsMenuOptions: [],
            loadDeferred: $q.defer(),
            initPromise: $q.when(true)
        };

        /* ----------  INITIALIZATION LOADING  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#setInitializationPromise
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Let you configuring an initialization promise before displaying content of sidebar-menu. This can be done in angular run phase.
         *  For example you can configure a promise that return the number of services per sections, ...
         *
         *  @param {Promise} initPromise A promise object.
         *
         *  @return {Promise} The initialized promise.
         */
        sidebarMenuService.setInitializationPromise = function (initPromise) {
            var self = this;

            if (initPromise && initPromise.then) {
                self.initPromise = initPromise;
            }

            return initPromise;
        };

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#loadInit
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Load the configured translations and initialization promise.
         *
         *  @return {Promise} That resolve the loadDeferred object with initialization promise returns values.
         */
        sidebarMenuService.loadInit = function () {
            var self = this;

            return $q.all({
                translations: self.loadTranslations(),
                init: self.initPromise
            }).then(function (data) {
                self.loadDeferred.resolve(data.init);
                self.manageStateChange();
                return self.loadDeferred.promise;
            });
        };

        /* ----------  TRANSLATIONS  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#loadTranslations
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Load the default translations of manager sidebar component and the extra translations files that you have added (if some).
         *
         *  @return {Promise} void
         */
        sidebarMenuService.loadTranslations = function () {
            angular.forEach(translationPaths, function (translationPath) {
                $translatePartialLoader.addPart(translationPath);
            });
            return $translate.refresh();
        };

        /* ----------  GETTER  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#getInnerMenuItemTemplatePath
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Get the inner menu item template path for displaying the inner html content of an item.
         *
         *  @return {String} The inner menu item template path for displaying the inner html content of an item. If you have configured it with the provider, this will return the configured path.
         */
        sidebarMenuService.getInnerMenuItemTemplatePath = function () {
            return innerMenuItemTemplatePath;
        };

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#getMinItemsForEnablingSearch
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Get the minimum items length for enabling search.
         *
         *  @return {Number} The minimum items length for enabling search.
         */
        sidebarMenuService.getMinItemsForEnablingSearch = function () {
            return minItemsForEnablingSearch;
        };

        /* ----------  ITEMS MANAGEMENT  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#addMenuItem
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Add a menu item to manager sidebar. It could be directly added as "root" element or to an already existing item.
         *
         *  @param {Object} itemOptions The options for adding a new manager sidebar menu item. See {@link sidebarMenu.object:SidebarMenuListItem SidebarMenuListItem} constructor for more details.
         *  @param {SidebarMenuListItem} parentItem The parent where to add the new sidebar menu item. If not specified, a "root" item will be added.
         *
         *  @return {SidebarMenuListItem} The added sidebar menu item.
         */
        sidebarMenuService.addMenuItem = function (itemOptions, parentItem) {
            var self = this;
            var menuItem;

            if (!parentItem) {
                itemOptions.level = 1;
                menuItem = new SidebarMenuListItem(itemOptions);
                self.items.push(menuItem);
            } else {
                itemOptions.level = parentItem.level + 1;
                menuItem = parentItem.addSubItem(itemOptions);
            }

            return menuItem;
        };

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#addMenuItems
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Add multiple sidebar menu items to an existing sidebar menu item (or as "root" items).
         *
         *  @param {Array<Object>} itemsOptions A list of item options to add to sidebar menu. See {@link sidebarMenu.object:SidebarMenuListItem SidebarMenuListItem} constructor for more details.
         *  @param {SidebarMenuListItem} parentItem The parent where to add the new sidebar menu items. If not specified, "root" items will be added.
         *
         *  @return {SidebarMenu} Current SidebarMenu service
         */
        sidebarMenuService.addMenuItems = function (itemsOptions, parentItem) {
            var self = this;

            angular.forEach(itemsOptions, function (itemOptions) {
                self.addMenuItem(itemOptions, parentItem);
            });

            return self;
        };

        /* ----------  SIDEBAR ACTIONS  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#manageMenuItemOpenAndActiveState
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Manage the open state and the active state of items of the manager sidebar menu.
         *
         *  @param {SidebarMenuListItem} menuItem The clicked sidebar menu item.
         *
         *  @return {SidebarMenu} Current SidebarMenu service
         */
        sidebarMenuService.manageMenuItemOpenAndActiveState = function (menuItem) {
            var self = this;

            return self.toggleMenuItemOpenState(menuItem).manageActiveMenuItem(menuItem);
        };

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#toggleMenuItemOpenState
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Manage the open state of items of the manager sidebar menu. This will ensure that only one item is open at a time.
         *
         *  @param {SidebarMenuListItem} menuItem The clicked sidebar menu item.
         *
         *  @return {SidebarMenu} Current SidebarMenu service
         */
        sidebarMenuService.toggleMenuItemOpenState = function (menuItem) {
            var self = this;
            var pathToMenuItem = self.getPathToMenuItem(menuItem).path;
            var openedItems = _.filter(self.getAllMenuItems(), { isOpen: true });

            // we simply close items that does not belong to the path to menuItem
            _.each(_.difference(openedItems, pathToMenuItem), function (item) {
                item.toggleOpen(); // close item
            });
            menuItem.toggleOpen();
            return self;
        };

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#manageActiveMenuItem
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Manage the active state of items of the manager sidebar menu. This will ensure that only one item is active at a time.
         *
         *  @param {SidebarMenuListItem} menuItem The clicked sidebar menu item.
         *
         *  @return {SidebarMenu} Current SidebarMenu service
         */
        sidebarMenuService.manageActiveMenuItem = (function () {
            var prevItem = null;
            return function (menuItem) {
                if (menuItem.state) {
                    if (prevItem) {
                        prevItem.isActive = false;
                    }
                    menuItem.isActive = true;
                    prevItem = menuItem;
                }
            };
        })();

        /* ----------  STATE CHANGE  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#manageStateChange
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Manage the active and open state of items when state is successfuly loaded. Called on $stateChangeSuccess.
         *
         *  @return {Promise} That resolve when every active subMenu item is loaded
         */
        sidebarMenuService.manageStateChange = (function () {

            function manageStateChangeRecur (items) {
                return $q.all(_.map(items, function (item) {
                    var stateInfos = getItemStateInfos(item);
                    if (stateInfos.current) {
                        sidebarMenuService.manageActiveMenuItem(item);
                        sidebarMenuService.toggleMenuItemOpenState(item);
                    }
                    if (stateInfos.included) {
                        return item.loadSubItems().then(function () {
                            if (item.hasSubItems() && !item.isOpen) {
                                item.toggleOpen();
                            }
                            sidebarMenuService.manageActiveMenuItem(item);
                            return manageStateChangeRecur(item.getSubItems());
                        });
                    }
                    return $q.when(true);
                }));
            }

            return function (menuItems) {
                return manageStateChangeRecur(menuItems || this.items);
            };
        })();

        /* ----------  ORDER ACTIONS MENU  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#addActionsMenuOption
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Add an item to order actions menu inside sidebar menu. See availabe options into actions-menu component.
         *
         *  @param {Object} actionMenuOptions Options of the action menu to add (see availabe options into actions-menu component).
         *
         *  @returns {Object} The added options.
         */
        sidebarMenuService.addActionsMenuOption = function (actionMenuOptions) {
            var self = this;

            self.actionsMenuOptions.push(actionMenuOptions);

            return actionMenuOptions;
        };

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#addActionsMenuOptions
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Add multiple items to order actions menu inside sidebar menu. See availabe options into actions-menu component.
         *
         *  @param {Array<Object>} actionMenuOptionsList List of options for adding entries into order actions menu (see availabe options into actions-menu component).
         *
         *  @returns {Array<Object>} The list of item options.
         */
        sidebarMenuService.addActionsMenuOptions = function (actionMenuOptionsList) {
            var self = this;

            angular.forEach(actionMenuOptionsList, function (actionMenuOptions) {
                self.addActionsMenuOption(actionMenuOptions);
            });

            return actionMenuOptionsList;
        };

        /* ----------  HELPERS  ----------*/

        function getItemStateInfos (item) {
            var infos = {
                included: false,
                current: false
            };
            if (item.state) {
                infos.included = $state.includes(item.state, item.stateParams);
                infos.current = $state.is(item.state, item.stateParams);
            } else if (item.loadOnState) {
                infos.included = $state.includes(item.loadOnState, item.loadOnStateParams);
                infos.current = $state.is(item.loadOnState, item.loadOnStateParams);
            }
            return infos;
        }

        /**
         * @ngdoc method
         * @name sidebarMenu.service:SidebarMenu#getPathToMenuItem
         * @methodOf sidebarMenu.service:SidebarMenu
         *
         * @description
         * Return the path to the specified item in the tree.
         *
         * @param {SidebarMenuListItem} item The item to get the path to
         *
         * @return {Object} Search result : { found: true/false, path: [] }
         */
        sidebarMenuService.getPathToMenuItem = function (item, items, currentSearch) {
            var self = this;
            currentSearch = currentSearch || { found: false, path: [] };
            if (!angular.isObject(item) || !item.id) {
                return currentSearch;
            }
            items = items || self.items;
            if (_.find(items, { id: item.id })) {
                currentSearch.found = true;
                currentSearch.path.push(item);
            } else {
                _.each(items, function (child) {
                    if (!currentSearch.found && child.hasSubItems()) {
                        currentSearch.path.push(child);
                        currentSearch = self.getPathToMenuItem(item, child.getSubItems(), currentSearch);
                        if (!currentSearch.found) {
                            currentSearch.path.pop();
                        }
                    }
                });
            }
            return currentSearch;
        };

        /**
         * @ngdoc method
         * @name sidebarMenu.service:SidebarMenu#getAllMenuItems
         * @methodOf sidebarMenu.service:SidebarMenu
         *
         * @description
         * Return a flatten list of all menu items
         *
         * @return {Array} Array of menu items
         */
        sidebarMenuService.getAllMenuItems = (function () {
            function flattenSubItems (items) {
                var mapped = _.map(items, function (item) {
                    return flattenSubItems(item.getSubItems());
                });
                _.each(mapped, function (item) {
                    items = items.concat(item);
                });
                return items;
            }

            return function () {
                return flattenSubItems(this.items || []);
            };
        })();

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#getItemById
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Find an item, given its id. The search is performed recursively inside the
         *  items tree. Don't be scared of performance issues since search result is
         *  cached, so subsequent search would be O(1) complexity.
         *
         *  @param {Number|String} itemId The unique id of the item you want to find.
         *
         *  @return {SidebarMenuListItem} The founded SidebarMenuListItem with given id.
         */
        sidebarMenuService.getItemById = (function () {
            var itemsMap = {}; // hash of itemId => item
            var found = false;

            function findRecursive (itemList, itemId) {
                if (!found && itemList && itemList.length) {
                    found = _.find(itemList, { id: itemId });
                    _.each(itemList, function (item) {
                        findRecursive(item.getSubItems(), itemId);
                    });
                }
            }

            return function (itemId, items) {
                found = itemsMap[itemId];
                findRecursive(items || this.items, itemId);
                if (found) {
                    itemsMap[itemId] = found; // cache search result
                }
                return found;
            };
        })();

        /* ----------  ITEM DISPLAY UPDATE  ----------*/

        /**
         *  @ngdoc method
         *  @name sidebarMenu.service:SidebarMenu#updateItemDisplay
         *  @methodOf sidebarMenu.service:SidebarMenu
         *
         *  @description
         *  Update the display options of a SidebarMenuListItem.
         *
         *  @param {Object} displayOptions Display options you want to update.
         *  @param {String} displayOptions.title The new title.
         *  @param {String} displayOptions.prefix The new prefix.
         *  @param {String} displayOptions.icon The new icon.
         *  @param {String} displayOptions.iconClass The new iconClass.
         *  @param {String} displayOptions.category The new category.
         *  @param {String} displayOptions.status The new status.
         *  @param {Number|String} itemId The unique id of the item you want to update display.
         *
         *  @return {SidebarMenuListItem} The founded SidebarMenuListItem with given id.
         */
        sidebarMenuService.updateItemDisplay = function (displayOptions, itemId) {
            var self = this;
            var item = self.getItemById(itemId);
            if (item) {
                displayOptions = _.pick(displayOptions, _.identity); // remove falsy attributes
                displayOptions = _.pick(displayOptions, ["title", "prefix", "icon", "iconClass", "category", "status"]);
                _.assign(item, displayOptions);
            }
            return item;
        };

        return sidebarMenuService;
    };

});
