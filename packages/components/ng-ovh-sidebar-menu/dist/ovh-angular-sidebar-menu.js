/**
 *  @ngdoc overview
 *  @name sidebarMenu
 *  @description
 *  # Sidebar Menu
 *
 *  Manage and display a left menu tree. This is the main module which holds everything together!
 *  See README for more informations.
 */
(function () {
    "use strict";

    angular.module("ovh-angular-sidebar-menu", ["ui.router", "pascalprecht.translate", "ng-slide-down", "ovh-angular-actions-menu"]);
})();

/**
 *  @ngdoc directive
 *  @name sidebarMenu.directive:sidebarMenuListItem
 *
 *  @restrict A
 *
 *  @description
 *  <p>This directive fill manager sidebar item ```<li></li>``` html element with given item.</p>
 *  <p>This shouln't be used outside the sidebarMenu module scope.</p>
 *
 *  @param {SidebarMenuListItem} sidebar-menu-list-item The menu item instance to display.
 */
angular.module("ovh-angular-sidebar-menu").directive("sidebarMenuListItem", ["$compile", function ($compile) {
    "use strict";

    return {
        templateUrl: "ovh-angular-sidebar-menu-list/ovh-angular-sidebar-menu-list-item/ovh-angular-sidebar-menu-list-item.html",
        restrict: "A",
        scope: {
            item: "=sidebarMenuListItem"
        },
        require: ["sidebarMenuListItem", "^sidebarMenuList"],
        link: function ($scope, $element, attribute, controllers) {
            var navElement;
            var sidebarMenuListItemCtrl = controllers[0];

            if (sidebarMenuListItemCtrl.item.allowSubItems) {
                // get nav element - where to append sub menu element
                navElement = $element.find("nav.menu-sub-items");
                if (!navElement.find("> .sub-menu").length) {
                    $compile("<ul data-sidebar-menu-list data-sidebar-menu-list-items='ItemMenuCtrl.item.subItems' class='sub-menu menu-level-{{ ItemMenuCtrl.item.level + 1 }}'></ul>")($scope, function (cloned) {
                        navElement.append(cloned);
                    });
                }
                sidebarMenuListItemCtrl.groupScrollElement = $element.find(".group-scroll-content");

                if (sidebarMenuListItemCtrl.item.infiniteScroll) {
                    sidebarMenuListItemCtrl.groupScrollElement.on("scroll", function () {
                        sidebarMenuListItemCtrl.addMoreItems();
                    });
                    $scope.$on("$destroy", function () {
                        sidebarMenuListItemCtrl.groupScrollElement.off("scroll");
                    });
                }

            } else {
                // no children allowed so free up the dom
                $element.find(".group-content-wrapper").empty();
            }
        },
        bindToController: true,
        controllerAs: "ItemMenuCtrl",
        controller: ["$scope", "$timeout", "SidebarMenu", function ($scope, $timeout, SidebarMenu) {

            var self = this;

            self.model = {
                search: null
            };

            self.loading = {
                search: false
            };

            /*= ==============================
            =            HELPERS            =
            ===============================*/

            self.getInnerTemplateUrl = function () {
                return SidebarMenu.getInnerMenuItemTemplatePath();
            };

            self.getMinItemsForEnablingSearch = function () {
                return SidebarMenu.getMinItemsForEnablingSearch();
            };

            self.isSearchEnabled = function () {
                if (self.item.allowSearch) {
                    if (self.item.subItemsAdded.length > self.getMinItemsForEnablingSearch()) {
                        return true;
                    }

                    // if there is less than 10 (by default) items of level 2, there is maybe more than 10 items of level 3
                    var searchableItemCount = 0;

                    // use of every to be abble to break loop
                    self.item.subItemsAdded.every(function (subItem) {
                        searchableItemCount += _.filter(subItem.subItemsAdded, {
                            searchable: true
                        }).length;

                        return searchableItemCount <= self.getMinItemsForEnablingSearch();
                    });

                    return searchableItemCount > self.getMinItemsForEnablingSearch();
                }

                return false;
            };

            /**
             * Returns scrollBar state :
             * {
             *     visible: is scrollbar visible?
             *     bottom: is scrollbar is close to the bottom?
             * }
             */
            $scope.$watch("item", function () {
                self.item.getScrollbar = function () {
                    var height = self.groupScrollElement.height();
                    var scrollHeight = self.groupScrollElement.get(0).scrollHeight;
                    var scrollTop = self.groupScrollElement.get(0).scrollTop;
                    var result = {
                        visible: scrollHeight > height,
                        bottom: scrollTop + height >= scrollHeight * 0.9
                    };
                    return result;
                };
            });

            self.addMoreItems = function () {
                self.item.appendPendingListItemsAsync();
            };

            /* -----  End of HELPERS  ------*/

            /*= ==============================
            =            ACTIONS            =
            ===============================*/

            self.onExternalLinkClick = function () {
                if (self.item.onClick) {
                    return self.item.onClick();
                }

                return true;
            };

            self.toggleItemOpenState = function () {
                self.errorVisible = false;

                // load sub items
                self.item.loadSubItems().then(function () {
                    // let SidebarMenu manage toggle states
                    SidebarMenu.toggleMenuItemOpenState(self.item);
                }).catch(function () {
                    self.errorVisible = true;
                });

                return true;
            };

            self.launchSearch = function () {
                self.item.filterSubItems(self.model.search);
            };

            self.viewMore = function () {

                if (!self.item.viewMore || !angular.isFunction(self.item.viewMore.action)) {
                    return;
                }

                // call view more action
                var result = self.item.viewMore.action();
                var promiseResult = null;

                // check if action returned a promise
                if (result && result.$promise) {
                    promiseResult = result.$promise;
                } else if (result && angular.isFunction(result.then)) {
                    promiseResult = result;
                }

                // scroll to bottom when action is complete
                if (promiseResult) {
                    promiseResult.then(function () {
                        return $timeout(function () {
                            self.groupScrollElement.animate({
                                scrollTop: self.groupScrollElement[0].scrollHeight
                            });
                        }, 250); // adding some delay helps to smooth the transition
                    });
                }
            };

            /* -----  End of ACTIONS  ------*/
        }]
    };
}]);

/**
 *  @ngdoc object
 *  @name sidebarMenu.object:SidebarMenuListItem
 *
 *  @requires $q
 *
 *  @description
 *  Factory that describe an item into manager sidebar menu.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").controller("MyTestCtrl", function ($q, SidebarMenuListItem) {
 *          var myMenuItem = new SidebarMenuListItem({
 *              title : "My beautiful title",
 *              state : "manager.my.state"
 *              stateParams : {
 *                  foo : "test",
 *                  test : "foo"
 *              },
 *              icon : "dots",
 *              allowSubItems : true,
 *              onLoad : function () {
 *                  return $q.when([]);
 *              }
 *          });
 *      });
 *  </pre>
 *
 *  @constructor
 *  @param {Object} options Options for creating a new SidebarMenuListItem.
 *  @param {Boolean=} [options.allowSearch=false] Flag telling if item allow search. Only available for item of level 1.
 *  @param {Boolean=} [options.allowSubItems=false] Flag telling if item allow to have sub items. If true will display an arrow icon before title.
 *  @param {String=} [options.category=none] Add a category to the item. This will be added as a new class to the menu item element.
 *  @param {String=} options.icon Icon added before prefix and title. Example : ovh-font icon!
 *  @param {Number|String=} [options.id=A random Number] Unique id of the SidebarMenuListItem.
 *  @param {Number=} options.level Menu item level.
 *  @param {Function=} [options.onClick=null] Function to be called on click event. Has to return true
 *  @param {Object} options.viewAllItem Links to a page that manages all subitems.
 *  @param {Object=} options.viewMore Custom object to implement your own pagination method.
 *  @param {String} options.viewMore.title The displayed title of the viewMore button.
 *  @param {Boolean} options.viewMore.enabled Should the viewMore button be displayed?
 *  @param {Boolean} options.viewMore.loading Should a loading spinner be displayed near the viewMore button?
 *  @param {Function} options.viewMore.action Custom pagination callback to be called when viewMore button is pressed. If this callback returns a promise, the scrollbar will scroll automatically to the bottom after the promise is resolved (when your paginated items have been added).
 *  @param {String=} options.loadOnState State that will automatically load the menu item. For this to work, states MUST be declared as parent/child (example of state name : parent.child.subchild).
 *  @param {Object=} [options.loadOnStateParams={}] StateParams that will that defines the state that will automatically load the menu item. Ignored if no loadOnState option.
 *  @param {Function=} options.onLoad Function called to load sub items. This function MUST return a promise.
 *  @param {Number|String=} [options.parentId=null] Unique id of the parent SidebarMenuListItem.
 *  @param {String=} options.prefix Prefix added befor item title.
 *  @param {String=} options.state State name where to redirect when clicking on item. Will be ignored if both options (state and url) are setted.
 *  @param {Object=} [options.stateParams={}] State params to add when switching state. Ignored if no state option.
 *  @param {String=} options.status Add a status to the item. This will be added as a new class to the menu item element.
 *  @param {String=} [options.target=_blank] Target attribute value that will be added to item link. Ignored if no url option.
 *  @param {String} options.title Title of the the menu item. This is what will be displayed (cropped if too long and the entire title will be in the title attribute).
 *  @param {String}  [options.error=none] Error message that will be displayed if loding promise is rejected.
 *  @param {String=} options.url Url to redirect when item link is clicked. Will be ignored if both options (url and state) are setted.
 *  @param {Boolean} options.infiniteScroll Should infinite scroll be used for scrolling subItems?
 *  @param {Boolean} [options.searchable=true] Flag telling if item is searchable, true by default, must be set to false to hide it from search.
 *  @param {String} [options.namespace] Namespace equals to Sidebar namespace.
 */

angular.module("ovh-angular-sidebar-menu").factory("SidebarMenuListItem", ["$q", "$timeout", function ($q, $timeout) {
    "use strict";

    /*= ==================================
    =            CONSTRUCTOR            =
    ===================================*/

    function SidebarMenuListItem (options) {
        if (!options) {
            options = {};
        }

        this.id = options.id || _.random(_.now());
        this.parentId = options.parentId || null;

        // for display
        this.title = options.title;
        this.error = options.error;
        this.prefix = options.prefix;
        this.icon = options.icon;
        this.category = options.category || "none";
        this.status = options.status || "none";

        // action item
        this.onClick = _.isFunction(options.onClick) ? options.onClick : null;

        this.namespace = options.namespace;

        // level informations
        this.level = options.level;

        // item loading
        this.onLoad = options.onLoad;
        this.loadOnState = options.loadOnState;
        this.loadOnStateParams = options.loadOnStateParams || {};
        this.isLoaded = false;
        this.loading = false;

        // state and url management
        if (options.state && !options.url) {
            this.state = options.state;
            this.stateParams = options.stateParams || {};
        } else if (options.url && !options.state) {
            this.url = options.url;
            this.target = options.target || "_blank";
        }

        // sub items
        this.subItems = [];

        /**
         * SubItemsPending is an attempt to optimize performance of sidebar menu.
         * When adding a subItem, it is first added to subItemPending list (which is not displayed).
         * When opening the item, the subItemsPending list is appended to subItems list.
         * It allow subItems to be added to the DOM only when they are displayed and increase a lot
         * performance for when the tree has lots of child nodes.
         */
        this.subItemsPending = [];

        // raw list containing all added subItems (used when clearing search results)
        this.subItemsAdded = [];
        this.allowSubItems = options.allowSubItems || false;
        this.viewAllItem = options.viewAllItem || null;

        // search
        if (this.level === 1) {
            this.allowSearch = options.allowSearch || false;
        }

        // view more
        this.viewMore = options.viewMore || null;

        this.isOpen = false;
        this.isActive = false;

        // string to perform search on
        this.searchable = options.searchable !== false;
        this.searchKey = angular.isString(this.id) ? this.id : "";
        if (angular.isString(this.title)) {
            this.searchKey += " " + this.title;
        }
        this.searchKey = this.searchKey.toLowerCase();
        this.noSearchResults = false;

        // use sexy infinite scroll?
        this.infiniteScroll = options.infiniteScroll || false;
    }

    /* -----  End of CONSTRUCTOR  ------*/

    /*= ========================================
    =            PROTOTYPE METHODS            =
    =========================================*/

    /* ----------  HELPERS  ----------*/

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#hasSubItems
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Check if an item has sub items.
     *
     *  @returns {Boolean} true if item has sub items. false otherwise.
     */
    SidebarMenuListItem.prototype.hasSubItems = function () {
        var self = this;

        // note: subItemsPending are subItems that are not displayed in the DOM
        return self.subItems.length > 0 || self.subItemsPending.length > 0;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#getSubItems
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Returns the list of sub items.
     *
     *  @returns {Array} the list of sub items.
     */
    SidebarMenuListItem.prototype.getSubItems = function () {
        // returns subItems and pending subItems (not already in the dom)
        return this.subItems.concat(this.subItemsPending);
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#getFullSref
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Build the full sref with state name and state params.
     *
     *  @returns {String} The full sref value setted into data-ui-sref item link attribute.
     */
    SidebarMenuListItem.prototype.getFullSref = function () {
        var self = this;

        return self.state + "(" + JSON.stringify(self.stateParams) + ")";
    };

    /* ----------  ACTIONS  ----------*/

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#loadSubItems
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Load the sub items of the current item.
     *
     *  @returns {Promise} That should return the list of sub SidebarMenuListItem instances loaded. Empty Array if no onLoad function or item does not allow sub items.
     */
    SidebarMenuListItem.prototype.loadSubItems = function (force) {
        var self = this;
        var promise = $q.when([]);

        if (self.onLoad && self.allowSubItems && !self.loading && (!self.isLoaded || force)) {
            // set loading flag
            self.loading = true;

            // load items
            promise = self.onLoad().then(function (result) {
                self.isLoaded = true;
                return result;
            }).finally(function () {
                self.loading = false;
            });
        }

        return promise;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#toggleOpen
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Toggle the open state of the item.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.toggleOpen = function () {
        var self = this;

        if (self.hasSubItems()) {
            self.isOpen = !self.isOpen;
        }

        // append pending subItems so they are displayed in the DOM
        if (self.isOpen && self.subItemsPending.length) {
            // self.appendPendingListItems();
            self.appendPendingListItemsAsync();
        }

        /**
         * Be ready for an awesome performance optimization ...
         *
         * When we close an item, subItems won't be visible so the angular bindings
         * and the DOM content of subItems is a cpu/memory waste right?
         *
         * So, we create a timeout that will eventually free up used $$watchers
         * and DOM element by moving subItems to pendingSubItems (remember that only
         * subItems are rendered in ng-repeat, not pendingSubItems).
         */
        if (!self.isOpen) {
            if (self._garbageCollect) {
                $timeout.cancel(self._garbageCollect);
            }
            self._garbageCollect = $timeout(function () {
                if (!self.isOpen) {
                    self.subItemsPending = self.subItems.concat(self.subItemsPending);
                    self.subItems = [];
                }
            }, 3000);
        }

        return self;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#appendPendingListItems
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Append the pending list of items to the sub items list.
     *  If the list of pending items is large it can be better to call
     *  SidebarMenuListItem#appendPendingListItemsAsync in order to
     *  not freeze the brower by flooding the DOM with subItems directives.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.appendPendingListItems = function () {
        var self = this;
        self.subItems = self.subItems.concat(self.subItemsPending);
        self.subItemsPending = [];
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#appendPendingListItemsAsync
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Append asynchronously the pending list of items to the sub items list.
     *  It allows to not freeze the browser when the list of pending items is large.
     *  Pending items are added in chunks of 5 sequentially by calling timeouts
     *  multiple times.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.appendPendingListItemsAsync = function () {
        var self = this;

        // timeout is here to wait for scrollbar being redrawn ...
        $timeout(function () {
            var chunk = _.slice(self.subItemsPending, 0, 5);

            if (self.infiniteScroll && self.getScrollbar) {
                var scrollbar = self.getScrollbar();
                if (scrollbar.visible && !scrollbar.bottom) {
                    return;
                }
            }
            if (chunk.length && self.isOpen) {
                self.subItemsPending = self.subItemsPending.slice(chunk.length);
                self.subItems = self.subItems.concat(chunk);
                $timeout(function () {
                    self.appendPendingListItemsAsync();
                }, 0);
            }
        });
    };

    /* ----------  ITEMS  ----------*/

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#addSubItem
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Add a sub menu item to sub items list.
     *
     *  @param {Object} subItemOptions Options of sub item that will be added. See constructor for more options informations.
     *
     *  @returns {SidebarMenuListItem} The added sub item.
     */
    SidebarMenuListItem.prototype.addSubItem = function (subItemOptions) {
        var self = this;
        var subItem = null;

        if (!self.allowSubItems) {
            return null;
        }

        subItem = new SidebarMenuListItem(angular.extend(subItemOptions, {
            parentId: self.id
        }));

        if (self.isOpen) {
            self.subItems.push(subItem);
        } else {
            // since parent item is not open, we add the child in a temporary list
            // so it will be added to the DOM only when parent will be opened
            self.subItemsPending.push(subItem);
        }

        self.subItemsAdded.push(subItem);

        return subItem;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#addSubItems
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Add multiple sub items to sub items list.
     *
     *  @param {Array<Object>} subItemsOptions Array of sub items options to add to item. See constructor for more options informations.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.addSubItems = function (subItemsOptions) {
        var self = this;

        if (!self.allowSubItems) {
            return self;
        }

        angular.forEach(subItemsOptions, function (subItemOptions) {
            self.addSubItem(subItemOptions);
        });

        return self;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#clearSubItems
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Empty list of sub items.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.clearSubItems = function () {
        this.subItems = [];
        this.subItemsPending = [];
        return this;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#addSearchKey
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Add a key for when searching / filtering items.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.addSearchKey = function (key) {
        if (angular.isString(key)) {
            this.searchKey += " " + key.toLowerCase();
        }
        return this;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#displaySearchResults
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Update items to display given search results.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.displaySearchResults = function (result) {
        var self = this;

        self.subItems = [];
        self.subItemsPending = result;
        self.noSearchResults = result.length === 0;

        // timeout is here so the scrollbar has time to be updated
        // after subItems is cleared, since calling appendPendingListItemsAsync
        // depends on sidebar size to append items
        $timeout(function () {
            self.appendPendingListItemsAsync();
        });

        return self;
    };

    /**
     *  @ngdoc method
     *  @name sidebarMenu.object:SidebarMenuListItem#filterSubItems
     *  @methodOf sidebarMenu.object:SidebarMenuListItem
     *
     *  @description
     *  Search for string "search" in item's searchKey and perform the
     *  search recursively in all subItems.
     *  Items not matching the "search" will be removed from the dom.
     *
     *  @returns {SidebarMenuListItem} Current instance of menu item.
     */
    SidebarMenuListItem.prototype.filterSubItems = (function () {
        // Recursively checks if item or subItems are matching the given search query
        // If an item of level 2 matches the search, return it with all subItems
        // If an item of level 3 matches the search, filter and attach it to its parent
        // If no match, return null
        function getMatchingItem (item, search) {
            var matchingItem;
            function isMatchingSearch (item, search) {
                return item.searchable && item.searchKey.indexOf(search) >= 0;
            }

            if (isMatchingSearch(item, search)) {
                return item;
            }

            matchingItem = new SidebarMenuListItem(angular.copy(item));
            angular.forEach(item.getSubItems(), function (subItem) {
                if (isMatchingSearch(subItem, search)) {
                    matchingItem.addSubItem(angular.copy(subItem));
                }
            });

            return matchingItem.hasSubItems() ? matchingItem : null;
        }

        return function (search) {
            var self = this;

            // search nothing => clear results
            if (!angular.isString(search)) {
                self.displaySearchResults(angular.copy(self.subItemsAdded));
            } else {
                search = search.toLowerCase(); // ignore case
                var filteredItems = [];
                var tmpMatchingItem;
                angular.forEach(self.subItemsAdded, function (item) {
                    tmpMatchingItem = getMatchingItem(item, search);

                    if (tmpMatchingItem) {
                        filteredItems.push(tmpMatchingItem);
                    }
                });
                self.displaySearchResults(filteredItems);
            }

            return self;
        };
    })();

    /* -----  End of PROTOTYPE METHODS  ------*/

    return SidebarMenuListItem;

}]);

/**
 *  @ngdoc directive
 *  @name sidebarMenu.directive:sidebarMenuList
 *
 *  @restrict A
 *
 *  @description
 *  <p>This directive fill manager sidebar ```<ul></ul>``` html element with given items.</p>
 *  <p>This shouln't be used outside the sidebarMenu module scope.</p>
 *
 *  @param {Array<SidebarMenuListItem>} sidebar-menu-list-items The items to be filled into list element of manager sidebar.
 */
angular.module("ovh-angular-sidebar-menu").directive("sidebarMenuList", function () {
    "use strict";

    return {
        templateUrl: "ovh-angular-sidebar-menu-list/ovh-angular-sidebar-menu-list.html",
        restrict: "A",
        scope: {
            items: "=sidebarMenuListItems",
            namespace: "=sidebarMenuListNamespace"
        },
        require: ["^sidebarMenu", "^?sidebarMenuListItem"],
        bindToController: true,
        controllerAs: "ListCtrl",
        controller: angular.noop
    };
});

angular.module("ovh-angular-sidebar-menu").controller("SidebarMenuCtrl", ["$transitions", "$compile", "$state", "SidebarMenu", function ($transitions, $compile, $state, SidebarMenu) {
    "use strict";

    var self = this;

    self.loading = {
        translations: false,
        init: false
    };

    self.items = null;

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    /* ----------  STATE CHANGE  ----------*/

    function initStateChangeSuccess () {
        $transitions.onSuccess({}, function () {
            SidebarMenu.manageStateChange();
        });
    }

    /* ----------  DIRECTIVE INITIALIZATION  ----------*/

    function init () {
        self.loading.init = true;

        return SidebarMenu.loadInit().then(function () {
            initStateChangeSuccess();
            self.items = SidebarMenu.items;
            self.actionsOptions = SidebarMenu.actionsMenuOptions;
            self.onActionsMenuSelectionOption = SidebarMenu.dispatchActionsMenuItemClick.bind(SidebarMenu);
            self.popoverSettings = {
                placement: "bottom-left",
                "class": "order-actions-menu-popover",
                trigger: "outsideClick"
            };
        }).finally(function () {
            self.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------*/

    init();

}]);

/**
 *  @ngdoc directive
 *  @name sidebarMenu.directive:sidebarMenu
 *
 *  @restrict A
 *
 *  @description
 *  <p>This is the base directive to load into your universe code. This directive will load the "root" items and will manage (with {@link sidebarMenu.service:SidebarMenu SidebarMenu service}) sub items loading and display.</p>
 *  <p>Basically, the directive will load the other module's directives (sidebarMenuMenu and sidebarMenuMenuItem).</p>
 */
angular.module("ovh-angular-sidebar-menu").directive("sidebarMenu", function () {
    "use strict";

    return {
        templateUrl: "ovh-angular-sidebar-menu.html",
        restrict: "A",
        replace: true,
        controllerAs: "sideBarCtrl",
        controller: "SidebarMenuCtrl",
        scope: {
            sidebarNamespace: "="
        }
    };
});

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

    var translationPaths = ["../bower_components/ovh-angular-sidebar-menu/dist/ovh-angular-sidebar-menu"];
    var innerMenuItemTemplatePath = "ovh-angular-sidebar-menu-list/ovh-angular-sidebar-menu-list-item/ovh-angular-sidebar-menu-list-item-inner.html";
    var minItemsForEnablingSearch = 10;

    /*= ====================================
    =            CONFIGURATION            =
    =====================================*/

    /* ----------  TRANSLATION  ----------*/

    /**
     *  @ngdoc function
     *  @name sidebarMenu.SidebarMenuProvider#clearTranslationPath
     *  @methodOf sidebarMenu.SidebarMenuProvider
     *
     *  @description
     *  Clear translations path
     *
     *  @return {Array} The list of translations to load.
     */
    self.clearTranslationPath = function () {
        translationPaths = [];
        return translationPaths;
    };

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

    self.$get = ["$q", "$timeout", "$state", "$translate", "$translatePartialLoader", "SidebarMenuListItem", function ($q, $timeout, $state, $translate, $translatePartialLoader, SidebarMenuListItem) {

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
            actionsMenuItemClickHandlers: [],
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
                            // Automatically close same level opened item if it is not current one
                            var openedItem = _.find(sidebarMenuService.getAllMenuItems(), { isOpen: true, level: item.level });
                            var someItemIsOpened = openedItem != null;

                            if (someItemIsOpened && openedItem.id !== item.id) {
                                openedItem.toggleOpen();
                            }

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

        /**
         * @ngdoc method
         * @name sidebarMenu.service:SidebarMenu#addActionsMenuItemClickHandler
         * @methodOf sidebarMenu.service:SidebarMenu
         *
         * @description
         * Add a callback to handle click on actions menu items. The callback
         * takes the id of the actions menu item as single parameter.
         *
         * @param {Function} handler The handler to add.
         */
        sidebarMenuService.addActionsMenuItemClickHandler = function (handler) {
            if (typeof handler !== "function") {
                throw new TypeError(handler + " is not a function");
            }

            if (this.actionsMenuItemClickHandlers.indexOf(handler) < 0) {
                this.actionsMenuItemClickHandlers.push(handler);
            }
        };

        /**
         * @ngdoc method
         * @name sidebarMenu.service:SidebarMenu#removeActionsMenuItemClickHandler
         * @methodOf sidebarMenu.service:SidebarMenu
         *
         * @description
         * Remove a callback use to handle click on actions menu items.
         *
         * @param {Function} handler The handler to remove.
         */
        sidebarMenuService.removeActionsMenuItemClickHandler = function (handler) {
            var handlerIndex = this.actionsMenuItemClickHandlers.indexOf(handler);
            if (handlerIndex > -1) {
                this.actionsMenuItemClickHandlers.splice(handlerIndex, 1);
            }
        };

        /**
         * @ngdoc method
         * @name sidebarMenu.service:SidebarMenu#dispatchActionsMenuItemClick
         * @methodOf sidebarMenu.service:SidebarMenu
         *
         * @description
         * Trigger all actions menu click handlers with a specified item id.
         *
         * @param {Number} id An actions menu item id.
         */
        sidebarMenuService.dispatchActionsMenuItemClick = function (id) {
            this.actionsMenuItemClickHandlers.forEach(function (handler) {
                handler(id);
            });
        };

        /* ----------  HELPERS  ----------*/

        function getItemStateInfos (item) {
            var infos = {
                included: false,
                current: false
            };
            if (item.loadOnState) {
                infos.included = $state.includes(item.loadOnState, item.loadOnStateParams);
                infos.current = $state.is(item.loadOnState, item.loadOnStateParams);
            } else if (item.state) {
                infos.included = $state.includes(item.state, item.stateParams);
                infos.current = $state.is(item.state, item.stateParams);
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
    }];

});

angular.module('ovh-angular-sidebar-menu').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-sidebar-menu-list/ovh-angular-sidebar-menu-list-item/ovh-angular-sidebar-menu-list-item-inner.html',
    "<!-- ARROW --> <span class=item-arrow data-ng-class=\"{ 'no-sub' : !ItemMenuCtrl.item.allowSubItems }\" data-ng-if=!ItemMenuCtrl.item.loading><i class=ovh-font data-ng-class=\"{ 'ovh-font-small-arrow-right' : !ItemMenuCtrl.item.isOpen, 'ovh-font-small-arrow-down' : ItemMenuCtrl.item.isOpen }\" data-ng-if=ItemMenuCtrl.item.allowSubItems></i> </span><!-- LOADING --> <span class=item-loading data-ng-if=ItemMenuCtrl.item.loading><div class=\"oui-spinner oui-spinner_s\"><div class=oui-spinner__container><div class=oui-spinner__image></div></div></div></span><!-- ITEM ICON --> <span class=item-icon data-ng-if=ItemMenuCtrl.item.icon><i data-ng-class=ItemMenuCtrl.item.icon></i> </span><!-- ITEM PREFIX --> <span class=item-prefix data-ng-bind=ItemMenuCtrl.item.prefix></span><!-- ITEM TITLE --> <span class=item-title data-ng-bind=ItemMenuCtrl.item.title></span>"
  );


  $templateCache.put('ovh-angular-sidebar-menu-list/ovh-angular-sidebar-menu-list-item/ovh-angular-sidebar-menu-list-item.html',
    "<div class=item-content><!-- item has sref and allow sub items --> <a class=menu-item data-ng-if=ItemMenuCtrl.item.state data-ng-click=ItemMenuCtrl.toggleItemOpenState() data-ui-sref=\"{{ :: ItemMenuCtrl.item.getFullSref() }}\" data-ng-include=ItemMenuCtrl.getInnerTemplateUrl()></a><!-- TOGGLE BUTTON --> <button class=\"menu-item text-left\" type=button data-ng-if=\"!ItemMenuCtrl.item.state && !ItemMenuCtrl.item.url && ItemMenuCtrl.item.allowSubItems\" data-ng-click=ItemMenuCtrl.toggleItemOpenState() data-ng-include=ItemMenuCtrl.getInnerTemplateUrl()></button><!-- ERROR MESSAGE --><div class=group-error-wrapper data-ng-if=\"ItemMenuCtrl.item.error && ItemMenuCtrl.errorVisible\"><div><i class=\"ovh-font ovh-font-filled-warning\"></i></div><div><p data-ng-bind=ItemMenuCtrl.item.error></p><button class=\"btn btn-default\" type=button data-ng-click=ItemMenuCtrl.toggleItemOpenState() data-translate=sidebar_menu_error_retry></button></div></div><!-- EXTERNAL LINK --> <a class=menu-item data-ng-if=\"ItemMenuCtrl.item.url && !ItemMenuCtrl.item.allowSubItems\" data-ng-href=\"{{ ItemMenuCtrl.item.url }}\" target=\"{{ ItemMenuCtrl.item.target }}\" data-ng-include=ItemMenuCtrl.getInnerTemplateUrl() data-ng-click=ItemMenuCtrl.onExternalLinkClick()></a><!-- SLIDING CONTENT --><div class=group-content-wrapper data-ng-slide-down=ItemMenuCtrl.item.isOpen data-duration=0.3><div class=group-toggle-content><!-- GROUP SEARCH --><div data-ng-if=ItemMenuCtrl.isSearchEnabled() class=group-search><form class=group-search-form data-ng-submit=ItemMenuCtrl.launchSearch()><div class=group-search-wrapper><i class=\"ovh-font ovh-font-search\"></i> <input placeholder=\"{{ 'sidebar_menu_search' | translate }}\" data-ng-change=ItemMenuCtrl.launchSearch() data-ng-model=ItemMenuCtrl.model.search data-ng-model-options=\"{ debounce: 300 }\"></div></form><em data-translate=sidebar_menu_search_no_results data-ng-if=ItemMenuCtrl.item.noSearchResults></em></div><div class=group-scroll-content><!-- GROUP ITEMS --><nav class=menu-sub-items></nav></div><div class=menu-view-all data-ng-if=ItemMenuCtrl.item.viewMore.enabled><div class=menu-view-all-inner><button class=\"menu-item text-left\" type=button data-ng-click=ItemMenuCtrl.viewMore() data-ng-disabled=ItemMenuCtrl.item.viewMore.loading><div class=\"oui-spinner oui-spinner_s\" data-ng-if=ItemMenuCtrl.item.viewMore.loading><div class=oui-spinner__container><div class=oui-spinner__image></div></div></div><span>{{ ItemMenuCtrl.item.viewMore.title }}</span></button></div></div><div class=menu-view-all data-ng-if=ItemMenuCtrl.item.viewAllItem><div class=menu-view-all-inner><a class=menu-item data-ng-href=\"{{ ItemMenuCtrl.item.viewAllItem.url }}\" target=\"{{ ItemMenuCtrl.item.viewAllItem.target }}\"><span data-ng-bind=ItemMenuCtrl.item.viewAllItem.title></span></a></div></div></div></div></div>"
  );


  $templateCache.put('ovh-angular-sidebar-menu-list/ovh-angular-sidebar-menu-list.html',
    "<li class=item-container data-ng-class=\"{\n" +
    "        'open' : item.isOpen,\n" +
    "        'active' : item.isActive,\n" +
    "        'category-{{item.category}}' : item.category !== 'none',\n" +
    "        'status-{{item.status}}' : item.status !== 'none',\n" +
    "    }\" data-ng-if=\"(ListCtrl.namespace && item.namespace ===  ListCtrl.namespace) || (!ListCtrl.namespace && !item.namespace)\" data-sidebar-menu-list-item=item data-ng-repeat=\"item in ListCtrl.items track by $index\"></li>"
  );


  $templateCache.put('ovh-angular-sidebar-menu.html',
    "<div id=sidebar-menu><!-- LOADER --><div class=text-center data-ng-if=sideBarCtrl.loading.init><div class=\"oui-spinner oui-spinner_m\"><div class=oui-spinner__container><div class=oui-spinner__image></div></div></div></div><div data-ng-if=!sideBarCtrl.loading.init><!-- MENU TITLE --><div class=sidebar-menu-title><button type=button class=\"navbar-button sideNavBtnClose pull-right\"><span class=\"ovh-font ovh-font-arrow-left\"></span></button> <span class=\"navbar-brand navbar-toggle-title\" data-translate=sidebar_menu></span></div><!-- ORDER ACTIONS MENU --><div class=order-actions-menu><actions-menu data-actions-menu-options=sideBarCtrl.actionsOptions data-actions-menu-popover-settings=sideBarCtrl.popoverSettings data-actions-menu-on-select-option=sideBarCtrl.onActionsMenuSelectionOption(id)><span class=cart-icon><i class=\"ovh-font ovh-font-cart\"></i> </span><span class=button-text data-translate=sidebar_menu_order_actions></span> <span class=arrow-icon><i class=\"ovh-font ovh-font-small-arrow-down\"></i></span></actions-menu></div><!-- MENU ITEMS --><ul class=\"sidebar-menu-list menu-level-1\" data-sidebar-menu-list data-sidebar-menu-list-items=sideBarCtrl.items data-sidebar-menu-list-namespace=sidebarNamespace></ul></div></div>"
  );

}]);
