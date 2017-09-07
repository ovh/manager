angular.module('ua.timePicker').directive('timePicker',
['$timeout',
function ($timeout) {
    'use strict';

    var TIME_REGEXP = '((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])(?::[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';

    return {
        restrict    : 'A',
        require     : '?ngModel',
        link        : function (scope, element, attrs, controller) {
            var timeRegExp,
                component,
                timepicker;

            if(controller) {
                element.on('changeTime.timepicker', function() {
                    $timeout(function() {
                        controller.$setViewValue(element.val());
                    });
                });

                // Handle input time validity
                timeRegExp = new RegExp('^' + TIME_REGEXP + '$', ['i']);

                // viewValue -> $parsers -> modelValue
                controller.$parsers.unshift(function(viewValue) {
                    if (!viewValue || timeRegExp.test(viewValue)) {
                        controller.$setValidity('time', true);
                        return viewValue;
                    } else {
                        controller.$setValidity('time', false);
                        return;
                    }
                });

            }

            // Create timepicker
            element.attr('data-toggle', 'timepicker');
            element.parent().addClass('bootstrap-timepicker');
            element.timepicker({});
            timepicker = element.data('timepicker');

            // Support add-on
            component = element.siblings('[data-toggle="timepicker"]');
            if(component.length) {
                component.on('click', $.proxy(timepicker.showWidget, timepicker));
            }
        }
    };
}]);
