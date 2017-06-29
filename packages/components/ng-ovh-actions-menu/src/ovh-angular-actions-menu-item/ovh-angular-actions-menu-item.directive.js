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
