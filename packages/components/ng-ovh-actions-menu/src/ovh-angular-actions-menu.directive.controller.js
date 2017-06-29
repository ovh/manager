angular.module("ovh-angular-actions-menu").controller("ActionsMenuCtrl", function (actionsMenu, ActionsMenu) {
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

});
