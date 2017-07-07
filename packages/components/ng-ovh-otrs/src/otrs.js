angular.module("ovh-angular-otrs")
    .config(function ($stateProvider) {
        "use strict";
        $stateProvider.state("otrs-list", {
            url: "/support",
            templateUrl: "app/module-otrs/otrs.html",
            controller: "OtrsCtrl",
            controllerAs: "OtrsCtrl",
            translations: ["common", "module-otrs"]
        });
    });
