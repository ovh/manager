angular.module('ua.typeOff').directive('typeOffItem', function () {
    "use strict";
    return {
        require     : '^typeOff',
        restrict    : 'A',
        link        : function (scope, element, attrs, controller) {

            var item = scope.$eval(attrs.typeOffItem);

            scope.$watch(function() {
                return controller.isActive(item);
            }, function(active) {
                if (active) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });

            element.bind('mouseenter', function () {
                scope.$apply(function () {
                    controller.activate(item);
                });
            });

            element.bind('click', function () {
                scope.$apply(function() {
                    controller.select(item);
                    controller.query();
                    controller.activateNextItem();
                    controller.hide();
                });
            });
        }
    };
});
