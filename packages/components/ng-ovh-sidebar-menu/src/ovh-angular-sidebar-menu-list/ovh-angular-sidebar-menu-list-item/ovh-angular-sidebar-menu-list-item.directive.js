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
angular.module("ovh-angular-sidebar-menu").directive("sidebarMenuListItem", function ($compile) {
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
        controller: function ($scope, $timeout, SidebarMenu) {

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
        }
    };
});
