"use strict";

angular.module("actionsMenuMock", ["ovh-angular-actions-menu", "templates"]);

angular.module("actionsMenuMock").config(function ($translateProvider) {
    $translateProvider.preferredLanguage("fr_FR");
    $translateProvider.fallbackLanguage("fr_FR");
    $translateProvider.useLoader("$translatePartialLoader", {
        urlTemplate: "src/translations/Messages_{lang}.json"
    });
    $translateProvider.useLoaderCache(true);
});

angular.module("actionsMenuMock").run(function ($httpBackend) {

    $httpBackend.whenGET("src/translations/Messages_fr_FR.json").respond(200, {});

});
