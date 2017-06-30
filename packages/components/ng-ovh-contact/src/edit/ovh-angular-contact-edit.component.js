(function () {
    "use strict";

    /**
     *  @ngdoc directive
     *  @name ovhContact.directive:ovhContactEdit
     *
     *  @restrict E
     *  @requires ovhContact.directive:ovhContact
     *
     *  @description
     *  <p>This directive allows you editing a contact (the contact selected by its parent - {@link ovhContact.directive:ovhContact ovhContact directive}) or creating a new contact.</p>
     *  <p><b>Note : </b>This directive is automatically loaded by its parent ({@link ovhContact.directive:ovhContact ovhContact}).</p>
     */
    angular.module("ovh-angular-contact").component("ovhContactEdit", {
        require: {
            ovhContactCtrl: "^ovhContact"
        },
        templateUrl: "edit/ovh-angular-contact-edit.html",
        controller: "OvhContactEditCtrl"
    });

})();
