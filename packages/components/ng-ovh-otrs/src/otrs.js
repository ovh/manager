angular.module("ovh-angular-otrs")
    .config(function ($stateProvider) {
        "use strict";

        var dedicatedManagerRedirect = function ($window, MANAGER_URLS) {
            $window.open(MANAGER_URLS.dedicated + "ticket", "_self");
        };
        $stateProvider.state("otrs-list1", {
            url: "/support",
            controller: dedicatedManagerRedirect
        });

        $stateProvider.state("otrs-list2", {
            url: "/ticket",
            controller: dedicatedManagerRedirect
        });
    });
