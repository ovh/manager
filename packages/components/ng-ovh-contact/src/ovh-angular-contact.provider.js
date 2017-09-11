/**
 *  @ngdoc object
 *  @name ovhContact.ovhContactProvider
 *
 *  @description
 *  ovhContactProvider allows developper to configure :
 *      - custom translations for contact management.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").config(function (ovhContactProvider) {
 *          // set translation path
 *          ovhContactProvider.setTranslationPath("../components/contact");
 *      });
 *  </pre>
 */
angular.module("ovh-angular-contact").provider("ovhContact", function () {
    "use strict";

    var self = this;

    var translationPath = "../bower_components/ovh-angular-contact/dist/ovh-angular-contact";

    /*= ==============================================
    =            PROVIDER CONFIGURATIONS            =
    ===============================================*/

    /**
     *  @ngdoc function
     *  @name ovhContact.ovhContactProvider#setTranslationPath
     *  @methodOf ovhContact.ovhContactProvider
     *
     *  @description
     *  Allows you to set an alternative translation path for contact management.
     *
     *  @param {String} path The translations file path.
     *
     *  @return {String} The new translation path.
     */
    self.setTranslationPath = function (path) {
        if (path) {
            translationPath = path;
        }

        return translationPath;
    };

    /* -----  End of PROVIDER CONFIGURATIONS  ------*/

    /*= =========================================
    =            OVHCONTACT SERVICE            =
    ==========================================*/

    self.$get = function ($q, $translate, $translatePartialLoader, OvhContact, OvhApiMe, CONTACT_EMAIL_REGEX) {

        /**
         *  @ngdoc service
         *  @name ovhContact.service:ovhContact
         *
         *  @requires $q
         *  @requires $translate
         *  @requires $translatePartialLoader
         *  @requires OvhContact
         *  @requires OvhApiMe
         *
         *  @description
         *  The `ovhContact` service is the actual core of ovhContact module. This service manage the contacts of the connected user.
         */

        var ovhContactService = {};
        var contacts = [];
        var schemas = null;

        /* ----------  PRIVATE  ----------*/

        /**
         *  @private
         *  Get /me ovh api schema. Call GET /me.json.
         */
        function getApiSchemas () {
            if (!schemas) {
                return OvhApiMe.Lexi().schema().$promise.then(function (apiSchemas) {
                    schemas = apiSchemas;
                    return schemas;
                });
            }
            return $q.when(schemas);

        }

        /**
         *  @private
         *  Convert nic address inforamtions to set contact.address informations.
         */
        function convertNicAddressToContactAddress (nic) {
            // keys are the contact address fields names / values are nic fields names
            var addressMapping = {
                line1: "address"
            };
            var contactAddress = {};

            angular.forEach(_.keys(schemas.models["contact.Address"].properties), function (key) {
                if (addressMapping[key] && nic.hasOwnProperty(addressMapping[key])) {
                    contactAddress[key] = nic[addressMapping[key]];
                } else if (nic.hasOwnProperty(key)) {
                    contactAddress[key] = nic[key];
                } else {
                    contactAddress[key] = null;
                }
            });

            return contactAddress;
        }

        /**
         *  @private
         *  Convert a nic to contact.
         */
        function convertNicToContact (nic) {
            // keys are the contact fields names / values are nic fields names
            var fieldMapping = {
                organisationName: "organisation",
                lastName: "name",
                gender: "sex"
            };
            var contact = {};

            // iterate into contact model to set nic infos
            angular.forEach(_.keys(schemas.models["contact.Contact"].properties), function (key) {
                if (key === "address") {
                    contact.address = convertNicAddressToContactAddress(nic);
                } else if (key === "birthDay") {
                    if (new RegExp(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/).test(nic[key])) {
                        var splittedDate = nic[key].split("/");
                        contact[key] = splittedDate.reverse().join("-");
                    } else {
                        contact[key] = null;
                    }
                } else if (fieldMapping[key] && (nic.hasOwnProperty(fieldMapping[key]) || nic.hasOwnProperty(fieldMapping[key.toLowerCase()]))) {
                    contact[key] = nic[fieldMapping[key]] || nic[fieldMapping[key.toLowerCase()]] || null;
                } else if (nic.hasOwnProperty(key) || nic.hasOwnProperty(key.toLowerCase())) {
                    contact[key] = nic[key] || nic[key.toLowerCase()] || null;
                } else {
                    contact[key] = null;
                }
            });

            return contact;
        }

        /* ----------  TRANSLATIONS  ----------*/

        /**
         *  @ngdoc method
         *  @name ovhContact.service:ovhContact#loadTranslations
         *  @methodOf ovhContact.service:ovhContact
         *
         *  @description
         *  Load the translations of ovh contact components.
         *
         *  @return {Promise} void
         */
        ovhContactService.loadTranslations = function () {
            $translatePartialLoader.addPart(translationPath);
            return $translate.refresh();
        };

        /* ----------  CONTACT LIST MANAGEMENT  ----------*/

        /**
         *  @ngdoc method
         *  @name ovhContact.service:ovhContact#addContact
         *  @methodOf ovhContact.service:ovhContact
         *
         *  @description
         *  Add a contact into contacts list.
         *
         *  @param {Object|OvhContact} contactOptions An object with options or an instance of OvhContact.
         *
         *  @return {OvhContact} The added contact.
         */
        ovhContactService.addContact = function (contactOptions) {
            var addedContact = contactOptions instanceof OvhContact ? contactOptions : new OvhContact(contactOptions);
            contacts.push(addedContact);
            return addedContact;
        };

        /**
         *  @ngdoc method
         *  @name ovhContact.service:ovhContact#getContactList
         *  @methodOf ovhContact.service:ovhContact
         *
         *  @description
         *  Get the entire list of contacts. This use api v7 to get all contacts details.
         *
         *  @param {Boolean} refresh Flag telling to fully recreate the contact list.
         *
         *  @return {Promise} That return an Array of OvhContact.
         */
        ovhContactService.getContactList = function (refresh) {
            var self = this;

            if (refresh) {
                contacts = [];
            }

            return OvhApiMe.Contact().Erika().query().expand().execute().$promise.then(function (contactsList) {
                // filter contact that are not already added
                // this avoid loosing contact object reference
                // then add contact to contact list (at given index)
                var contactsToAdd = _.chain(contactsList).map("value").reject(function (contact) {
                    return _.some(contacts, {
                        id: contact.id
                    });
                }).value();

                _.forEach(contactsToAdd, function (contact) {
                    self.addContact(contact);
                });

                return contacts;
            });
        };

        /* ----------  CREATION RULES  ----------*/

        /**
         *  @ngdoc method
         *  @name ovhContact.service:ovhContact#getCreationRules
         *  @methodOf ovhContact.service:ovhContact
         *
         *  @description
         *  Get the rules for creating a new ovh contact.
         *
         *  @return {Object} Representing the rules for creating an new contact.
         */
        ovhContactService.getCreationRules = function () {
            var models = null;

            function updateCreationRules (rules) {
                angular.forEach(rules, function (value, key) {
                    if (angular.isDefined(models[value.fullType])) {
                        if (models[value.fullType]) {
                            if (angular.isArray(models[value.fullType].enum)) {
                                var enumId = models[value.fullType].id.replace(/Enum$/, "").toLowerCase();
                                rules[key].values = [];
                                angular.forEach(models[value.fullType].enum, function (value) {
                                    rules[key].values.push({
                                        label: $translate.instant([["country", "language"].indexOf(enumId) > -1 ? enumId : _.snakeCase("ovh_contact_edit_" + enumId), value].join("_")),
                                        value: value
                                    });
                                });
                            } else if (angular.isObject(models[value.fullType].properties)) {
                                angular.forEach(updateCreationRules(models[value.fullType].properties), function (subValue, subKey) {
                                    rules[[key, subKey].join(".")] = subValue;
                                });
                            }
                        }
                    }

                    // TODO API hack, phone is mandatory
                    if (key === "phone") {
                        value.canBeNull = 0;
                    } else if (key === "email") {
                        value.regularExpression = CONTACT_EMAIL_REGEX;
                    }
                });
                return rules;
            }

            return getApiSchemas().then(function (schemas) {
                models = schemas.models;
                return updateCreationRules(models["contact.Contact"].properties);
            });
        };

        /* ----------  CONNECTED USER  ----------*/

        /**
         *  @ngdoc method
         *  @name ovhContact.service:ovhContact#getConnectedUser
         *  @methodOf ovhContact.service:ovhContact
         *
         *  @description
         *  Get the connected user informations. Call GET /me API.
         *
         *  @return {Object} Representing the connected user.
         */
        ovhContactService.getConnectedUser = function () {
            return OvhApiMe.Lexi().get().$promise;
        };

        /**
         *  @ngdoc method
         *  @name ovhContact.service:ovhContact#convertConnectedUserToContact
         *  @methodOf ovhContact.service:ovhContact
         *
         *  @description
         *  Convert the connected user nic to an ovh contact.
         *
         *  @return {Promise} That returns an OvhContact instance.
         */
        ovhContactService.convertConnectedUserToContact = function () {
            var self = this;

            return self.getConnectedUser().then(function (nic) {
                return getApiSchemas().then(function () {
                    return new OvhContact(convertNicToContact(nic));
                });
            });
        };

        return ovhContactService;
    };

    /* -----  End of OVHCONTACT SERVICE  ------*/

});
