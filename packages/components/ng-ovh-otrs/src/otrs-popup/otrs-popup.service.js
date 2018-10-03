angular.module("ovh-angular-otrs")
    .service("OtrsPopupService", function ($rootScope) {
        "use strict";

        var self = this;
        var actions = ["minimize", "maximize", "restore", "close", "open"];
        var isLoaded = false;
        var isOpen = false;

        angular.forEach(actions, function (action) {
            self[action] = function (id) {
                $rootScope.$broadcast("otrs.popup." + action, id);
            };
        });

        this.toggle = function () {
            if ($("[data-otrs-popup] .draggable").hasClass("close")) {
                self.open();
                isOpen = true;
                $rootScope.$broadcast("otrs.popup.opened");
            } else {
                self.close();
                isOpen = false;
                $rootScope.$broadcast("otrs.popup.closed");
            }
        };

        this.init = function () {
            self.open();
            isLoaded = true;
            isOpen = true;
            $rootScope.$broadcast("otrs.popup.opened");
        };

        this.isLoaded = function () {
            return isLoaded;
        };

        this.isOpen = function () {
            return isOpen;
        };

    });
