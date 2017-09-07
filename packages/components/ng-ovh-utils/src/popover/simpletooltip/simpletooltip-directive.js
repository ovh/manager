angular.module('ua.popover').directive('simpletooltipPopup', function () {
    "use strict";
    return {
        restrict  : 'A',
        replace   : true,
        scope     : {
            tooltipContent   : '@popoverTooltipContent',
            tooltipPlacement : '@popoverTooltipPlacement',
            tooltipIsOpen    : '=popoverTooltipIsOpen'
        },
        template  : '<div class="tooltip {{tooltipPlacement}} fade" ng-class="{ in: tooltipIsOpen}">' +
        '<div class="tooltip-arrow"></div>' +
        '<div class="tooltip-inner">' +
        '<div data-ng-bind-html="tooltipContent"></div>'+
        '</div>' +
        '</div>'
    };
}).directive('simpletooltip', ['popoverFactory', function (popover) {
    "use strict";
    return popover('simpletooltip', 'mouseenter');
}]);
