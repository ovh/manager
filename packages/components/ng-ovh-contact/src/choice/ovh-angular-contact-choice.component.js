(function () {
    "use strict";

    /**
     *  @ngdoc directive
     *  @name ovhContact.directive:ovhContactChoice
     *
     *  @restrict E
     *  @scope
     *  @requires ovhContact.directive:ovhContact
     *
     *  @description
     *  <p>This directive allows you selecting a contact from /me/contact list or from a custom list.</p>
     *  <p>It provides possibility to add/edit a contact.</p>
     *  <p><b>Note : </b>This directive is automatically loaded by its parent ({@link ovhContact.directive:ovhContact ovhContact}).</p>
     *
     *  @param {Function=} ovhContactChoiceFilter A filter function that will be called to filter contacts list (for filtering identical contacts for example).
     *  @param {Array<OvhContact>=} ovhContactChoiceCustomList A custom list of contact. Using this won't load the contact list and creation/edition won't be possible.
     *  @param {Object=} ovhContactChoiceOptions Others options available for selecting a contact.
     *  @param {Boolean=} [ovhContactChoiceOptions.allowCreation=true] Allow or not contact creation.
     *  @param {Boolean=} [ovhContactChoiceOptions.allowEdition=true] Allow or not contact creation.
     *  @param {Boolean=} [ovhContactChoiceOptions.autoCreateContact=true] Auto create a contact from connected nic informations if contact list is empty.
     */
    angular.module("ovh-angular-contact").component("ovhContactChoice", {
        transclude: true,
        require: {
            ovhContactCtrl: "^ovhContact"
        },
        templateUrl: "choice/ovh-angular-contact-choice.html",
        controller: "OvhContactChoiceCtrl",
        bindings: {
            filter: "&?ovhContactChoiceFilter",
            customList: "=?ovhContactChoiceCustomList",
            options: "=?ovhContactChoiceOptions"
        }
    });

})();
