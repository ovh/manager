angular.module("ovh-angular-otrs")
    .provider("OtrsPopup", function () {
        "use strict";

        var self = this;
        var baseUrlTickets = null;

        self.setBaseUrlTickets = function (url) {
            if (angular.isDefined(url) && angular.isString(url)) {
                baseUrlTickets = url;
            } else {
                throw new Error("An URL must be specified.");
            }
        };

        self.$get = function () {
            return {
                getBaseUrlTickets: function () {
                    return baseUrlTickets;
                }
            };
        };
    });
