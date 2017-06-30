/**
 *  @ngdoc overview
 *  @name ovhContact
 *
 *  @requires ovh-api-services
 *  @requires ui.select
 *  @requires internationalPhoneNumber
 *  @requires pascalprecht.translate
 *
 *  @description
 *  # ovhContact
 *
 *  Main module of the application.
 *  This module helps you dealing with ovh contacts from /me/contact API.
 */
(function () {
    "use strict";

    angular.module("ovh-angular-contact", [
        "ovh-api-services",
        "ui.select",
        "internationalPhoneNumber",
        "pascalprecht.translate"
    ]);

})();
