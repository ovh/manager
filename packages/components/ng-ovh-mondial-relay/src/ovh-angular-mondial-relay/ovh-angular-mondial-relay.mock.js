"use strict";

angular.module("mondialRelayMock", ["ovh-angular-mondial-relay", "templates"]);

angular.module("mondialRelayMock").config(function ($translateProvider) {
    $translateProvider.preferredLanguage("fr_FR");
    $translateProvider.fallbackLanguage("fr_FR");
    $translateProvider.useLoader("$translatePartialLoader", {
        urlTemplate: "src/translations/Messages_{lang}.json"
    });
    $translateProvider.useLoaderCache(true);
});

angular.module("mondialRelayMock").run(function ($httpBackend) {

    $httpBackend.whenGET("src/translations/Messages_fr_FR.json").respond(200, {});

});
