angular.module("ovh-angular-contact").controller("OvhContactCtrl", function ($timeout, ovhContact, OvhContact) {
    "use strict";

    var self = this;
    var tmpContact = null;

    self.loading = {
        load: false,
        init: false
    };

    /*= ==============================
    =            HELPERS            =
    ===============================*/

    self.startContactCreation = function () {
        tmpContact = self.contact;
        self.contact = new OvhContact();
        return self.contact;
    };

    self.stopContactCreation = function () {
        self.contact = tmpContact;
        tmpContact = null;
        return self.contact;
    };

    self.manageOnInit = function () {
        if (self.initDeferred) {
            return $timeout(self.initDeferred.resolve);
        }
    };

    /* -----  End of HELPERS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    self.$onInit = function () {
        self.loading.init = true;

        // check params
        self.onlyCreate = self.onlyCreate === "true";
        if (self.initDeferred && _.isUndefined(self.initDeferred.promise)) {
            throw new Error("ovh-angular-contact: initDeferred must be a deferred object.");
        }

        if (self.onlyCreate) {
            self.startContactCreation();
        }

        return ovhContact.loadTranslations().finally(function () {
            self.loading.init = false;
        });
    };

    self.$onDestroy = function () {
        if (self.contact) {
            self.contact.stopEdition(true);
        }
    };

    /* -----  End of INITIALIZATION  ------*/

});
