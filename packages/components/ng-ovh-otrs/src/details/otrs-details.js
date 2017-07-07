angular.module("ovh-angular-otrs")
    .config(function ($stateProvider) {
        "use strict";
        $stateProvider.state("otrs-details", {
            url: "/support/{id:int}/details",
            templateUrl: "app/module-otrs/details/otrs-details.html",
            controller: "OtrsDetailsCtrl",
            controllerAs: "OtrsDetailsCtrl",
            translations: ["common", "module-otrs", "module-otrs/details"]
        });
    });
