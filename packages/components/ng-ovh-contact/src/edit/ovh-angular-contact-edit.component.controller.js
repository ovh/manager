angular.module("ovh-angular-contact").controller("OvhContactEditCtrl", function ($q, $timeout, $anchorScroll, ovhContact, OvhContact, CONTACT_EDITION) {
    "use strict";

    var self = this;

    var alwaysVisibleFieldsByCountry = false;

    self.loading = {
        init: false
    };

    self.datepicker = {
        open: false,
        format: "shortDate",
        options: {
            showWeeks: false,
            maxDate: moment()
        }
    };

    self.creationRules = null;
    self.sortedFieldsByCountry = null;
    self.saveError = null;

    /*= ==============================
    =            ACTIONS            =
    ===============================*/

    self.cancelEdition = function () {
        if (!self.ovhContactCtrl.contact.id) {
            self.ovhContactCtrl.stopContactCreation();
        } else {
            self.ovhContactCtrl.contact.stopEdition(true);
        }
        $anchorScroll();
    };

    self.saveContact = function () {
        var savePromise;

        self.ovhContactCtrl.loading.load = true;

        savePromise = self.ovhContactCtrl.contact.id ? self.ovhContactCtrl.contact.save() : self.ovhContactCtrl.contact.create().then(function () {
            return ovhContact.addContact(self.ovhContactCtrl.contact);
        });

        return savePromise.then(function () {
            self.ovhContactCtrl.contact.stopEdition();
        }, function (error) {
            self.saveError = error;
            $anchorScroll();
        }).finally(function () {
            self.ovhContactCtrl.loading.load = false;
        });
    };

    /* -----  End of ACTIONS  ------*/

    /*= ==============================
    =            HELPERS            =
    ===============================*/

    function clear () {
        self.saveError = null;

        self.sortedFieldsByCountry = CONTACT_EDITION["SORTED_FIELDS_" + self.ovhContactCtrl.contact.country] || CONTACT_EDITION.SORTED_FIELDS_DEFAULT;
        alwaysVisibleFieldsByCountry = CONTACT_EDITION["ALWAYS_VISIBLE_FIELDS_" + self.ovhContactCtrl.contact.country] || CONTACT_EDITION.ALWAYS_VISIBLE_FIELDS_DEFAULT;
    }

    function formatPhoneNumbers (phoneNumber) {
        // .replace("+", "")
        return phoneNumber ? phoneNumber.replace(".", "") : phoneNumber;
    }

    self.isVisibleField = function (field) {
        var isVisible = !!(self.creationRules && self.creationRules[field] && self.creationRules[field].canBeNull === 0);

        if (!isVisible && alwaysVisibleFieldsByCountry.indexOf(field) !== -1) {
            isVisible = true;
        }

        if (!isVisible) {
            self.ovhContactCtrl.contact[field] = null;
        }

        return isVisible;
    };

    self.getFieldType = function (field) {
        if (/mail/i.test(field)) {
            return "email";
        } else if (/phone|fax/i.test(field)) {
            return "tel";
        } else if (field === "birthDay") {
            return "date";
        }
        return "text";
    };

    self.getFieldTranslationKey = function (field) {
        return ["ovh_contact_edit_label", _.snakeCase(field)].join("_");
    };

    self.formatedPhone = function (phoneValue) {
        return arguments.length > 0 ? (self.ovhContactCtrl.contact.phone = phoneValue) : formatPhoneNumbers(self.ovhContactCtrl.contact.phone);
    };

    self.formatedCellPhone = function (phoneValue) {
        return arguments.length > 0 ? (self.ovhContactCtrl.contact.cellPhone = phoneValue) : formatPhoneNumbers(self.ovhContactCtrl.contact.cellPhone);
    };

    self.forcePhoneFormat = function ($event, field) {
        // use timeout to force phone number to be undefined if only country dial code or to be prefixed by "+" (international format) if phone number value starts with country dialcode
        $timeout(function () {
            var countryData = $($event.target).intlTelInput("getSelectedCountryData");
            if (self.ovhContactCtrl.contact[field] === countryData.dialCode || !self.ovhContactCtrl.contact[field]) {
                self.ovhContactCtrl.contact[field] = undefined;
            } else if (_.startsWith(self.ovhContactCtrl.contact[field], countryData.dialCode)) {
                self.ovhContactCtrl.contact[field] = "+" + self.ovhContactCtrl.contact[field];
            }
        });
    };

    /* -----  End of HELPERS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    /* ----------  Component initialization  ----------*/

    self.$onInit = function () {
        self.loading.init = true;
        self.ovhContactCtrl.loading.load = true;

        clear();

        return ovhContact.getCreationRules().then(function (rules) {
            self.creationRules = rules;
            self.ovhContactCtrl.manageOnInit();
        }).finally(function () {
            self.loading.init = false;
            self.ovhContactCtrl.loading.load = false;
        });
    };

    /* -----  End of INITIALIZATION  ------*/

});
