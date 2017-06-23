"use strict";
angular.module("ovh-angular-stop-event").directive("ovhStopEvent", function () {
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            element.bind(attr.ovhStopEvent, function (e) {
                if (!attr.ovhStopEventDisabled || attr.ovhStopEventDisabled !== "true") {
                    e.stopPropagation();
                }
            });
        }
    };
});
