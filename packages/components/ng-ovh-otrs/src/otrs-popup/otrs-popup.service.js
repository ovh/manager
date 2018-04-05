angular.module("ovh-angular-otrs")
    .service("OtrsPopupService", function ($rootScope) {
        "use strict";

        var self = this;
        var actions = ["minimize", "maximize", "restore", "close", "open"];
        var isLoaded = false;

        angular.forEach(actions, function (action) {
            self[action] = function (id) {
                $rootScope.$broadcast("otrs.popup." + action, id);
            };
        });

        this.toggle = function () {
            if ($("[data-otrs-popup] .draggable").hasClass("close")) {
                self.open();
            } else {
                self.close();
            }
        };

        this.init = function () {
            self.open();
            isLoaded = true;
        };

        this.isLoaded = function () {
            return isLoaded;
        };

    });
