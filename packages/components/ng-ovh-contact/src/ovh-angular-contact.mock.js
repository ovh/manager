"use strict";

angular.module("ovh-api-services", ["ngResource", "ovh-angular-apiv7"]).service("OvhApiMe", function ($resource, Apiv7Endpoint) {
    return {
        Lexi: function () {
            return $resource("/me", {}, {
                schema: {
                    method: "GET",
                    url: "/me.json"
                }
            });
        },
        Contact: function () {
            return {
                Lexi: function () {
                    return $resource("/me/contact/:contactId", {
                        contactId: "@contactId"
                    }, {
                        create: {
                            method: "POST"
                        }
                    });
                },
                Erika: function () {
                    return new Apiv7Endpoint("/me/contact/:contactId", {
                        contactId: "@contactId"
                    }, {
                        query: {
                            url: "/me/contact",
                            method: "GET",
                            isArray: true,
                            serviceType: "apiv7"
                        }
                    });
                }
            };
        }
    };
});

angular.module("ovhContactMock", ["ovh-angular-contact", "templates"]);

angular.module("ovhContactMock").config(function ($translateProvider) {
    $translateProvider.preferredLanguage("fr_FR");
    $translateProvider.fallbackLanguage("fr_FR");
    $translateProvider.useLoader("$translatePartialLoader", {
        urlTemplate: "src/translations/Messages_{lang}.json"
    });
    $translateProvider.useLoaderCache(true);
});

angular.module("ovhContactMock").run(function ($httpBackend) {

    // translation messages load mock
    $httpBackend.whenGET("src/translations/Messages_fr_FR.json").respond(200, {});

    // contact calls mocks
    $httpBackend.whenGET("/me.json").respond(200, {
        models: {
            "contact.Contact": {
                properties: {}
            }
        }
    });
    $httpBackend.whenGET("/me").respond(200, {
        firstname: "foo",
        name: "bar",
        city: "test",
        country: "FR",
        zip: 12345,
        address: "the address"
    });
    $httpBackend.whenGET("/me/contact?$expand=1").respond(200, []);
    $httpBackend.whenPOST("/me/contact").respond(200, {
        firstName: "foo",
        lastName: "bar",
        address: {
            city: "test",
            country: "FR",
            zip: 12345,
            line1: "the address"
        },
        id: 54321
    });

});
