"use strict";

angular.module("sidebarMenuMock", ["ovh-angular-sidebar-menu", "templates"]);

angular.module("sidebarMenuMock").config(function ($translateProvider) {
    $translateProvider.preferredLanguage("fr_FR");
    $translateProvider.fallbackLanguage("fr_FR");
    $translateProvider.useLoader("$translatePartialLoader", {
        urlTemplate: "src/translations/Messages_{lang}.json"
    });
    $translateProvider.useLoaderCache(true);
});

angular.module("sidebarMenuMock").run(function ($httpBackend) {

    $httpBackend.whenGET("src/translations/Messages_fr_FR.json").respond(200, {});

});
