angular
    .module('ua.popover')
    .directive('simplepopoverPopup', function () {
        "use strict";
        return {
            restrict  : 'A',
            replace   : true,
            scope     : {
                popoverTooltipTitle     : '@',
                popoverTooltipContent   : '@',
                popoverTooltipPlacement : '@',
                popoverTooltipRemote    : '@',
                popoverTooltipId        : '@',
                popoverTooltipIsOpen    : '='
            },
            templateUrl : 'components/ovh-utils-angular/popover/simplepopover/simplepopover.html'
        };
    }).directive('simplepopover', ['popoverFactory', function (popover) {
        "use strict";
        return popover('simplepopover', 'click');
    }]);
