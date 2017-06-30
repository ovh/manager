angular.module("ovh-angular-contact").controller("OvhContactChoiceCtrl", function ($q, ovhContact) {
    "use strict";

    var self = this;

    self.loading = {
        init: false
    };

    self.list = null;

    /*= ==============================
    =            HELPERS            =
    ===============================*/

    function checkDefaultOptions () {
        self.options = _.defaults(self.options || {}, {
            allowCreation: true,
            allowEdition: true,
            autoCreateContact: true
        });
    }

    self.searchInList = function (search) {
        if (search) {
            return _.filter(self.list, function (contact) {
                return contact.firstName.toLowerCase().indexOf(search.toLowerCase()) || contact.lastName.toLowerCase().indexOf(search.toLowerCase());
            });
        }

        return self.list;

    };

    /* -----  End of HELPERS  ------*/

    /*= ==============================
    =            ACTIONS            =
    ===============================*/

    self.editContact = function () {
        self.ovhContactCtrl.contact.startEdition();
    };

    self.createContact = function () {
        self.ovhContactCtrl.startContactCreation().startEdition();
    };

    /* -----  End of ACTIONS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    /* ----------  Component initialization  ----------*/

    self.$onInit = function () {
        var initPromise = $q.when(true);

        self.loading.init = true;
        self.ovhContactCtrl.loading.load = true;

        // check options
        checkDefaultOptions();

        if (!self.customList) {
            initPromise = ovhContact.getContactList().then(function (contacts) {
                // check if there is a filter to apply
                self.list = _.sortBy(self.filter && _.isFunction(self.filter()) ? self.filter()(contacts) : contacts, "lastName");

                // auto select a contact from connected nic
                if (!self.ovhContactCtrl.contact && self.list.length === 0 && self.options.autoCreateContact) {
                    initPromise = ovhContact.convertConnectedUserToContact().then(function (contactFromNic) {
                        return contactFromNic.create().then(function () {
                            ovhContact.addContact(contactFromNic);
                            self.ovhContactCtrl.contact = contactFromNic;
                        });
                    });
                } else if (!self.ovhContactCtrl.contact) {
                    initPromise = ovhContact.getConnectedUser().then(function (user) {
                        self.ovhContactCtrl.contact = _.find(self.list, {
                            lastName: user.name,
                            firstName: user.firstname,
                            email: user.email
                        }) || self.list[0];
                    });
                } else if (!_.find(self.list, { id: self.ovhContactCtrl.contact.id })) {
                    self.ovhContactCtrl.contact = self.list[0];
                }
            });
        } else {
            self.list = _.sortBy(self.filter && _.isFunction(self.filter()) ? self.filter()(self.customList) : self.customList, "lastName");
            self.ovhContactCtrl.contact = self.list[0];
        }

        return initPromise.then(self.ovhContactCtrl.manageOnInit).finally(function () {
            self.loading.init = false;
            self.ovhContactCtrl.loading.load = false;
        });
    };

    /* -----  End of INITIALIZATION  ------*/

});
