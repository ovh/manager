angular.module("ovh-angular-responsive-popover").directive("responsivePopoverPopup", function () {
    "use strict";

    return {
        replace: true,
        scope: {
            uibTitle: "@",
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "ovh-angular-responsive-popover-popup/ovh-angular-responsive-popover-popup.html"
    };
});
