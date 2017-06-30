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
            items: "=sidebarMenuListItems"
        },
        require: ["^sidebarMenu", "^?sidebarMenuListItem"],
        bindToController: true,
        controllerAs: "ListCtrl",
        controller: function () {
            // EMPTY
        }
    };
});
