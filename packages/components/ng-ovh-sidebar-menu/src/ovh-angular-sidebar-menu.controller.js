angular.module("ovh-angular-sidebar-menu").controller("SidebarMenuCtrl", function ($transitions, $compile, $state, SidebarMenu) {
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

});
