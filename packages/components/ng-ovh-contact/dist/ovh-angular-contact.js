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

angular.module("ovh-angular-contact").controller("OvhContactChoiceCtrl", ["$q", "ovhContact", function ($q, ovhContact) {
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

}]);

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

angular.module("ovh-angular-contact").controller("OvhContactEditCtrl", ["$q", "$timeout", "$anchorScroll", "ovhContact", "OvhContact", "CONTACT_EDITION", function ($q, $timeout, $anchorScroll, ovhContact, OvhContact, CONTACT_EDITION) {
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

}]);

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

angular.module("ovh-angular-contact").controller("OvhContactCtrl", ["$timeout", "ovhContact", "OvhContact", function ($timeout, ovhContact, OvhContact) {
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

}]);

(function () {
    "use strict";

    /**
     *  @ngdoc directive
     *  @name ovhContact.directive:ovhContact
     *
     *  @restrict E
     *  @scope
     *
     *  @description
     *  <p>This is the base directive to load into your code. This will manage for you contact selection and/or contact creation.</p>
     *  <p><b>Note: </b>ovh-contact directive allows transclusion to display a custom loader (bouncing-box-loader for Telecom, spinner for cloud, ...).</p>
     *
     *  @example
     *  In your controller:
     *  <pre>
     *      angular.module("myModule").controller("myController", function ($q) {
     *          this.model = {
     *              contact: null
     *          };
     *
     *          this.choiceOptions = {
     *              filter: function (contacts) {
     *                  return _.filter(contacts, { id: 123 });
     *              },
     *              options: {
     *                  allowCreation: false
     *              }
     *          };
     *
     *          this.initDeferred = $q.defer();
     *
     *          this.initDeferred.promise.then(function () {
     *              console.log("Contact is automatically selected", this.model.contact);
     *          });
     *      });
     *  </pre>
     *
     *  In your HTML:
     *  <pre>
     *      <div data-ng-controller="myController as $ctrl">
     *          <ovh-contact data-ng-model="$ctrl.model.contact"
     *                       data-ovh-contact-choice-options="$ctrl.choiceOptions"
     *                       data-ovh-contact-init-deferred="$ctrl.initDeferred">
     *              <div data-my-custom-loader></div> <!-- Will be transcluded during ovh-contact directive loading phases -->
     *          </ovh-contact>
     *      </div>
     *  </pre>
     *
     *  @param {OvhContact} ngModel The contact selected or created.
     *  @param {Boolean=} [ovhContactOnlyCreate=false] Force to only create a contact.
     *  @param {Object=} ovhContactChoiceOptions Options for ovhContactChoice directive (a child directive). See {@link ovhContact.directive:ovhContactChoice ovhContactChoice} for more details.
     *  @param {Deferred=} ovhContactInitDeferred A deferred object to allow you waiting that all directives are initialized.
     */
    angular.module("ovh-angular-contact").component("ovhContact", {
        transclude: true,
        templateUrl: "ovh-angular-contact.html",
        controller: "OvhContactCtrl",
        bindings: {
            contact: "=ngModel",
            onlyCreate: "@ovhContactOnlyCreate",
            choiceOptions: "=?ovhContactChoiceOptions",
            initDeferred: "=?ovhContactInitDeferred"
        }
    });

})();

(function () {
    "use strict";

    angular.module("ovh-angular-contact").constant("CONTACT_EDITION", {
        SORTED_FIELDS_DEFAULT: {
            generalInformations: ["gender", "address.country", "legalForm", "firstName", "lastName", "nationality", "language"],
            legal: ["organisationType", "organisationName", "companyNationalIdentificationNumber", "associationNationalIdentificationNumber", "vat"],
            profile: ["address.line1", "address.line2", "address.line3", "address.otherDetails", "address.zip", "address.city", "address.province", "birthDay", "birthZip", "birthCity", "birthCountry"],
            contacts: ["email", "emailConfirmation", "nationalIdentificationNumber", "phone", "cellPhone", "fax"]
        },
        ALWAYS_VISIBLE_FIELDS_DEFAULT: [
            "address.country",
            "legalForm",
            "firstName",
            "lastName",
            "email",
            "emailConfirmation",
            "gender",
            "nationality",
            "organisationType",
            "organisationName",
            "companyNationalIdentificationNumber",
            "vat",
            "address.line1",
            "address.line2",
            "address.line3",
            "address.otherDetails",
            "address.zip",
            "address.city",
            "address.province",
            "birthDay",
            "birthZip",
            "birthCity",
            "birthCountry",
            "nationalIdentificationNumber",
            "phone",
            "cellPhone",
            "fax",
            "language"
        ]
    }).constant("CONTACT_PROTOTYPE_PATH", [
        "organisationName",
        "vat",
        "spareEmail",
        "email",
        "birthDay",
        "phone",
        "cellPhone",
        "fax",
        "id",
        "firstName",
        "lastName",
        "address.country",
        "address.line1",
        "address.line2",
        "address.line3",
        "address.otherDetails",
        "address.zip",
        "address.city",
        "address.province",
        "gender",
        "language",
        "organisationType",
        "legalForm",
        "birthCity",
        "birthZip",
        "birthCountry",
        "nationality",
        "nationalIdentificationNumber",
        "companyNationalIdentificationNumber",
        "emailConfirmation"
    ]).constant("CONTACT_EMAIL_REGEX", "^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]{2}(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$");
})();

/**
 *  @ngdoc object
 *  @name ovhContact.object:OvhContact
 *
 *  @requires OvhApiMe
 *
 *  @description
 *  Factory that describe the representation of an ovh contact.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").controller("MyTestCtrl", function (OvhContact) {
 *          var myContact = new OvhContact({
 *              email: "my-contact@email.com",
 *              firstName: "my-contact-firstName",
 *              lastName: "my-contact-lastName"
 *          });
 *      });
 *  </pre>
 *
 *  @constructor
 *  @param {Object} options Options for creating a new OvhContact.
 *  @param {Object=} options.address Address representation of the contact.
 *  @param {String=} [options.address.country=FR] Country where lives the contact.
 *  @param {String=} options.address.line1 Main informations about the address of the contact.
 *  @param {String=} options.address.line2 Additional informations about the address of the contact.
 *  @param {String=} options.address.line3 Additional informations about the address of the contact.
 *  @param {String=} options.address.otherDetails Other details about the address of the contact.
 *  @param {String=} options.address.zip Zip code where lives the contact.
 *  @param {String=} options.address.city City where lives the contact.
 *  @param {String=} options.address.province Province where lives the contact.
 *  @param {String=} options.birthDay The birth date of the contact (must be a valid date string).
 *  @param {String=} options.birthCity City where the contact is born.
 *  @param {String=} [options.birthCountry=FR] Birth country of the contact.
 *  @param {String=} options.birthZip Zip code of the city where the contact is born.
 *  @param {String=} options.cellPhone Cellphone number of the contact.
 *  @param {String=} options.companyNationalIdentificationNumber Company national identification number of the contact.
 *  @param {String=} options.email Email address of the contact.
 *  @param {String=} options.fax Fax number of the contact.
 *  @param {String=} options.firstName First name of the contact.
 *  @param {String=} [options.gender=male] Gender of the contact.
 *  @param {Number=} options.id The unique id of the contact.
 *  @param {String=} [options.language=fr_FR] Language spoken by the contact.
 *  @param {String=} options.lastName Last name of the contact.
 *  @param {String=} [options.legalForm=individual] Legal form of the contact.
 *  @param {String=} [options.nationality=FR] Nationality of the contact.
 *  @param {String=} options.nationalIdentificationNumber National identification number of the contact.
 *  @param {String=} options.organisationName The organisation name of the contact.
 *  @param {String=} options.organisationType Organisation type of the contact.
 *  @param {String=} options.phone Phone number of the contact.
 *  @param {String=} options.spareEmail Spare email address of the contact.
 *  @param {String=} options.vat The VAT number of the contact.
 */

angular.module("ovh-angular-contact").factory("OvhContact", ["OvhApiMe", "CONTACT_PROTOTYPE_PATH", function (OvhApiMe, CONTACT_PROTOTYPE_PATH) {
    "use strict";

    var getDatas = function (instance) {
        var datas = {};

        angular.forEach(CONTACT_PROTOTYPE_PATH, function (path) {
            if (path === "birthDay") {
                datas.birthDay = angular.isDate(instance.birthDay) ? moment(instance.birthDay).format("YYYY-MM-DD") : undefined;
            } else {
                _.set(datas, path, _.get(instance, path));
            }
        });

        return datas;
    };

    /*= ==================================
    =            CONSTRUCTOR            =
    ===================================*/

    function OvhContact (options) {
        if (!options) {
            options = {};
        }

        // from api
        this.organisationName = options.organisationName;
        this.vat = options.vat;
        this.spareEmail = options.spareEmail;
        this.email = options.email;
        this.phone = options.phone;
        this.cellPhone = options.cellPhone;
        this.fax = options.fax;
        this.id = options.id;
        this.firstName = options.firstName;
        this.lastName = options.lastName;
        this.address = options.address || {
            country: undefined,
            line1: undefined,
            line2: undefined,
            line3: undefined,
            otherDetails: undefined,
            zip: undefined,
            city: undefined,
            province: undefined
        };
        this.gender = options.gender || "male";
        this.language = options.language || "fr_FR";
        this.organisationType = options.organisationType;
        this.legalForm = options.legalForm || "individual";

        this.nationality = options.nationality || "FR";
        this.nationalIdentificationNumber = options.nationalIdentificationNumber;
        this.companyNationalIdentificationNumber = options.companyNationalIdentificationNumber;
        this.birthCity = options.birthCity;
        this.birthZip = options.birthZip;
        this.birthCountry = options.birthCountry || "FR";
        this.birthDay = options.birthDay && moment(new Date(options.birthDay)).isValid() ? new Date(options.birthDay) : undefined;

        // custom attributes
        this.inEdition = false;
        this.saveForEdition = null;
        this.emailConfirmation = options.email;

        // default value of address country
        if (this.address && !this.address.country) {
            this.address.country = "FR";
        }
    }

    /* -----  End of CONSTRUCTOR  ------*/

    /*= ========================================
    =            PROTOTYPE METHODS            =
    =========================================*/

    /* ----------  API CALL  ----------*/

    /**
     *  @ngdoc method
     *  @name ovhContact.object:OvhContact#save
     *  @methodOf ovhContact.object:OvhContact
     *
     *  @description
     *  Save the current contact instance options. Call PUT /me/contact/{contactId} API.
     *
     *  @returns {Promise} That returns the current instance of OvhContact.
     */
    OvhContact.prototype.save = function () {
        var self = this;

        return OvhApiMe.Contact().Lexi().save({
            contactId: self.id
        }, getDatas(self)).$promise.then(function () {
            return self;
        });
    };

    /**
     *  @ngdoc method
     *  @name ovhContact.object:OvhContact#create
     *  @methodOf ovhContact.object:OvhContact
     *
     *  @description
     *  Create an ovh contact with the current options. Call POST /me/contact/{contactId} API.
     *
     *  @returns {Promise} That returns the current instance of OvhContact created.
     */
    OvhContact.prototype.create = function () {
        var self = this;

        return OvhApiMe.Contact().Lexi().create({}, getDatas(self)).$promise.then(function (contact) {
            self.id = contact.id;
            return self;
        });
    };

    /* ----------  EDITION  ----------*/

    /**
     *  @ngdoc method
     *  @name ovhContact.object:OvhContact#startEdition
     *  @methodOf ovhContact.object:OvhContact
     *
     *  @description
     *  Start the edition of a contact. Create a copy of current options to allow you to revert when necessary.
     *
     *  @returns {OvhContact} The current instance of OvhContact.
     */
    OvhContact.prototype.startEdition = function () {
        var self = this;

        self.inEdition = true;
        self.saveForEdition = {};

        angular.forEach(CONTACT_PROTOTYPE_PATH, function (objectPath) {
            _.set(self.saveForEdition, objectPath, angular.copy(_.get(self, objectPath)));
        });

        return self;
    };

    /**
     *  @ngdoc method
     *  @name ovhContact.object:OvhContact#stopEdition
     *  @methodOf ovhContact.object:OvhContact
     *
     *  @description
     *  Stop the edition of the contact.
     *
     *  @param {Boolean=} cancel Flag telling if we have to reset saved options when startEdition has been called.
     *
     *  @returns {OvhContact} The current instance of OvhContact.
     */
    OvhContact.prototype.stopEdition = function (cancel) {
        var self = this;

        self.inEdition = false;

        if (self.saveForEdition && cancel) {
            angular.forEach(CONTACT_PROTOTYPE_PATH, function (objectPath) {
                _.set(self, objectPath, angular.copy(_.get(self.saveForEdition, objectPath)));
            });
        }

        self.saveForEdition = null;
        self.inEdition = false;

        return self;
    };

    /**
     *  @ngdoc method
     *  @name ovhContact.object:OvhContact#hasChange
     *  @methodOf ovhContact.object:OvhContact
     *
     *  @description
     *  Check if the contact options have been modified since startEdition has been called.
     *
     *  @param {String=} path Path of the attributes of the contact to check. If not provided, this will check all attributes paths of the instance.
     *
     *  @returns {Boolean} True if an options has changed. False otherwise.
     */
    OvhContact.prototype.hasChange = function (path) {
        var self = this;

        if (!self.saveForEdition) {
            return false;
        }

        if (path) {
            return _.get(self, path) !== _.get(self.saveForEdition, path);
        }
        return !!_.find(CONTACT_PROTOTYPE_PATH, function (objPath) {
            return self.hasChange(objPath);
        });

    };

    /* -----  End of PROTOTYPE METHODS  ------*/

    return OvhContact;

}]);

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

    self.$get = ["$q", "$translate", "$translatePartialLoader", "OvhContact", "OvhApiMe", "CONTACT_EMAIL_REGEX", function ($q, $translate, $translatePartialLoader, OvhContact, OvhApiMe, CONTACT_EMAIL_REGEX) {

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
    }];

    /* -----  End of OVHCONTACT SERVICE  ------*/

});

angular.module('ovh-angular-contact').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('choice/ovh-angular-contact-choice.html',
    "<div class=ovh-contact-choice><ui-select data-ng-model=$ctrl.ovhContactCtrl.contact data-theme=choice/templates data-remove-selected=false><ui-select-match placeholder=\"{{ 'ovh_contact_choice_select_contact' | translate }}\"><!-- SELECTED USER DISPLAY --><div class=\"dtable full-width\"><!-- USER ICON --><div class=\"dtd right-space-m16\"><div class=badge><i class=\"fa fa-user fa-5x\"></i></div></div><!-- USER ICON --><!-- ADDRESS --><div class=dtd><address class=\"inline-block vertical-middle text-left no-space\"><strong data-ng-bind=\"$ctrl.ovhContactCtrl.contact.firstName + ' ' + $ctrl.ovhContactCtrl.contact.lastName\"></strong><div data-ng-bind=$ctrl.ovhContactCtrl.contact.address.line1></div><div data-ng-bind=\"$ctrl.ovhContactCtrl.contact.address.zip + ' ' + $ctrl.ovhContactCtrl.contact.address.city + ' - ' + $ctrl.ovhContactCtrl.contact.address.country\"></div></address></div><!-- ADDRESS --><!-- AVAILABLE ACTIONS --><div class=\"dtd text-right\"><button type=button class=\"btn btn-default btn-xs\" data-translate-attr=\"{ title: 'ovh_contact_display_edit_contact' }\" data-ng-if=$ctrl.options.allowEdition data-ng-click=$ctrl.editContact()><i class=\"ovh-font ovh-font-editer\"></i></button> <button type=button class=\"btn btn-default btn-xs\" data-translate-attr=\"{ title: 'ovh_contact_display_add_contact' }\" data-ng-if=$ctrl.options.allowCreation data-ng-click=$ctrl.createContact()><i class=\"ovh-font ovh-font-ajouter\"></i></button> <button type=button class=\"btn btn-default btn-xs\" data-translate-attr=\"{ title: 'ovh_contact_display_change_contact' }\" data-ng-click=$select.toggle($event)><i class=\"ovh-font ovh-font-search\"></i></button></div><!-- AVAILABLE ACTIONS --></div><!-- SELECTED USER DISPLAY --></ui-select-match><ui-select-choices data-repeat=\"contact in $ctrl.searchInList($select.search) track by contact.id\"><div ng-bind-html=\"contact.firstName + ' ' + contact.lastName\"></div><small data-ng-bind=contact.address.line1></small><br><small data-ng-bind=\"contact.address.zip + ' ' + contact.address.city + ' - ' + contact.address.country\"></small></ui-select-choices></ui-select></div>"
  );


  $templateCache.put('choice/templates/match.tpl.html',
    "<div class=\"ui-select-match form-control clearfix\" data-ng-disabled=$select.disabled><div class=full-width><div data-ng-hide=$select.isEmpty() class=ui-select-match-text data-ng-class=\"{'ui-select-allow-clear': $select.allowClear && !$select.isEmpty()}\" data-ng-transclude=\"\"></div></div></div>"
  );


  $templateCache.put('choice/templates/select.tpl.html',
    "<div class=\"ui-select-container ovh-contact-select ui-select-bootstrap clearfix\" data-ng-class=\"{open: $select.open}\"><div class=\"ui-select-match clearfix\"></div><div class=\"ui-select-dropdown ui-select-dropdown-container dropdown\" data-ng-class=\"{ open: $select.open }\" data-ng-show=$select.open><div class=search-container><input type=search autocomplete=off tabindex=-1 aria-expanded=true aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"form-control ui-select-search\" data-ng-class=\"{ 'ui-select-search-hidden' : !$select.searchEnabled }\" data-ng-model=$select.search data-ng-show=$select.open placeholder={{$select.placeholder}}></div><div class=ui-select-choices></div><div class=ui-select-no-choice></div></div></div>"
  );


  $templateCache.put('edit/ovh-angular-contact-edit.html',
    "<form class=\"ovh-contact-edit form-horizontal ovh-form-flat\" data-ng-submit=$ctrl.saveContact() name=ovhContactEdit><div data-ng-if=$ctrl.saveError class=\"alert alert-danger\" role=alert><i class=\"fa fa-lg fa-warning\"></i> <span data-translate=ovh_contact_edit_save_error data-translate-values=\"{ message: $ctrl.saveError.data.message }\"></span></div><p data-translate=ovh_contact_edit_mandatory_fields></p><fieldset data-ng-repeat=\"(fieldset, fields) in $ctrl.sortedFieldsByCountry track by $index\"><legend data-translate=\"{{ 'ovh_contact_edit_fieldset_' + fieldset }}\"></legend><div data-ng-repeat=\"field in fields track by $index\"><div data-ng-if=$ctrl.isVisibleField(field) data-ng-switch=field><!-- country --><div class=form-group data-ng-switch-when=address.country><label for=country class=col-xs-12>{{ ('ovh_contact_edit_label_country' | translate) + ($ctrl.creationRules[\"address.country\"].canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><select class=form-control name=country id=country data-ng-options=\"country.value as country.label for country in $ctrl.creationRules['address.country'].values | orderBy:'label'\" data-ng-model=$ctrl.ovhContactCtrl.contact.address.country data-ng-required=!$ctrl.creationRules.address.country.canBeNull></select></div></div><!-- legalform --><div class=form-group data-ng-switch-when=legalForm><label for=legalform class=col-xs-12>{{ ('ovh_contact_edit_label_legal_form' | translate) + ($ctrl.creationRules.legalform.canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><select class=form-control name=legalform id=legalform data-ng-options=\"item.value as item.label | translate for item in $ctrl.creationRules['legalForm'].values\" data-ng-model=\"$ctrl.ovhContactCtrl.contact['legalForm']\" data-ng-required=!$ctrl.creationRules.legalForm.canBeNull></select></div></div><!-- birthDay --><div class=form-group data-ng-switch-when=birthDay><div flat-input-container><label class=col-xs-12 for=birthDay>{{ ('ovh_contact_edit_label_birth_day' | translate) + ($ctrl.creationRules.birthDay.canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><input class=form-control id=birthDay name=birthDay readonly placeholder=\"{{ ('ovh_contact_edit_label_birth_day' | translate) + ($ctrl.creationRules.birthDay.canBeNull ? '' : ' *') }}\" data-ng-model=$ctrl.ovhContactCtrl.contact.birthDay data-ng-pattern=$ctrl.creationRules.birthDay.regularExpression data-ng-required=!$ctrl.creationRules.birthDay.canBeNull data-ng-focus=\"$ctrl.datepicker.open = true\" data-uib-datepicker-popup=\"{{ $ctrl.datepicker.format }}\" data-datepicker-mode=$ctrl.datepicker.mode data-datepicker-options=$ctrl.datepicker.options data-show-button-bar=false data-is-open=$ctrl.datepicker.open></div></div></div><!-- emailConfirmation --><div class=form-group data-ng-switch-when=emailConfirmation><div flat-input-container><label class=col-xs-12 for=email_confirmation>{{ ('ovh_contact_edit_label_email_confirmation' | translate) + ($ctrl.creationRules.email.canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><input type=email class=form-control id=email_confirmation name=email_confirmation placeholder=\"{{ ('ovh_contact_edit_label_email_confirmation' | translate) + ($ctrl.creationRules.email.canBeNull ? '' : ' *') }}\" data-ng-model=$ctrl.ovhContactCtrl.contact.emailConfirmation autocomplete=false data-ng-required=!$ctrl.creationRules.email.canBeNull data-ng-pattern=$ctrl.creationRules.email.regularExpression data-match=$ctrl.ovhContactCtrl.contact.email></div><div data-ng-messages=ovhContactEdit[field].$error data-ng-show=\"ovhContactEdit[field].$dirty && ovhContactEdit[field].$touched\" role=alert class=col-xs-12><label for=\"{{ field }}\" data-ng-message=required data-translate=ovh_contact_edit_mandatory_field></label><label for=\"{{ field }}\" data-ng-message=pattern data-translate=ovh_contact_edit_invalid_email></label></div></div></div><!-- PHONE --><div class=form-group data-ng-switch-when=phone><label for=phone class=col-xs-12>{{ ('ovh_contact_edit_label_phone' | translate) + ($ctrl.creationRules.phone.canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><input international-phone-number data-number-type=FIXED_LINE data-national-mode=false data-default-country=\"{{ $ctrl.ovhContactCtrl.contact.address.country }}\" data-preferred-countries=\"\" data-ng-model=$ctrl.formatedPhone data-ng-model-options=\"{ getterSetter: true }\" data-ng-blur=\"$ctrl.forcePhoneFormat($event, field)\" name=phone id=phone class=form-control data-ng-required=!$ctrl.creationRules.phone.canBeNull></div><div data-ng-messages=ovhContactEdit.phone.$error data-ng-show=\"ovhContactEdit.phone.$dirty && ovhContactEdit.phone.$touched\" role=alert class=col-xs-12><label for=\"{{ field }}\" data-ng-message=required data-translate=ovh_contact_edit_mandatory_field></label><label for=\"{{ field }}\" data-ng-message=internationalPhoneNumber data-translate=ovh_contact_edit_invalid_phone></label></div></div><!-- CELL PHONE --><div class=form-group data-ng-switch-when=cellPhone><label for=cellphone class=col-xs-12>{{ ('ovh_contact_edit_label_cell_phone' | translate) + ($ctrl.creationRules.cellPhone.canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><input international-phone-number data-national-mode=false data-allow-dropdown=false data-default-country=\"{{ $ctrl.ovhContactCtrl.contact.address.country }}\" data-preferred-countries=\"\" data-ng-model=$ctrl.formatedCellPhone data-ng-model-options=\"{ getterSetter: true }\" data-ng-blur=\"$ctrl.forcePhoneFormat($event, field)\" name=cellphone id=cellphone class=form-control data-ng-required=!$ctrl.creationRules.cellPhone.canBeNull></div><div data-ng-messages=ovhContactEdit.cellphone.$error data-ng-show=\"ovhContactEdit.cellphone.$dirty && ovhContactEdit.cellphone.$touched\" role=alert class=col-xs-12><label for=cellphone data-ng-message=required data-translate=ovh_contact_edit_mandatory_field></label><label for=cellphone data-ng-message=internationalPhoneNumber data-translate=ovh_contact_edit_invalid_phone></label></div></div><!-- others --><div data-ng-switch-default data-ng-switch=!$ctrl.creationRules[field].values><div data-ng-switch-when=true data-ng-switch=\"field.indexOf('address') > -1\"><!-- SPECIAL FOR ADDRESS FIELD BECAUSE NGMODEL CAN'T ACCESS TO contact['address.city'] --><div data-ng-switch-when=true flat-input-container class=form-group><label for={{field}} class=col-xs-12>{{ ($ctrl.getFieldTranslationKey(field) | translate) + ($ctrl.creationRules[field].canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><input type={{$ctrl.getFieldType(field)}} class=form-control id={{field}} name={{field}} placeholder=\"{{ ($ctrl.getFieldTranslationKey(field) | translate) + ($ctrl.creationRules[field].canBeNull ? '' : ' *') }}\" data-ng-model=\"$ctrl.ovhContactCtrl.contact.address[field.split('.')[1]]\" data-ng-required=!$ctrl.creationRules[field].canBeNull data-ng-pattern=$ctrl.creationRules[field].regularExpression></div><div data-ng-messages=ovhContactEdit[field].$error data-ng-show=\"ovhContactEdit[field].$dirty && ovhContactEdit[field].$touched\" role=alert class=col-xs-12><label for=\"{{ field }}\" data-ng-message=required data-translate=ovh_contact_edit_mandatory_field></label><label for=\"{{ field }}\" data-ng-message=pattern data-translate=\"{{ 'ovh_contact_edit_invalid_' + field }}\"></label></div></div><!-- SPECIAL FOR ADDRESS FIELD --><div data-ng-switch-default flat-input-container class=form-group><label for={{field}} class=col-xs-12>{{ ($ctrl.getFieldTranslationKey(field) | translate) + ($ctrl.creationRules[field].canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><input type={{$ctrl.getFieldType(field)}} class=form-control id={{field}} name={{field}} placeholder=\"{{ ($ctrl.getFieldTranslationKey(field) | translate) + ($ctrl.creationRules[field].canBeNull ? '' : ' *') }}\" data-ng-model=$ctrl.ovhContactCtrl.contact[field] data-ng-required=!$ctrl.creationRules[field].canBeNull data-ng-pattern=$ctrl.creationRules[field].regularExpression></div><div data-ng-messages=ovhContactEdit[field].$error data-ng-show=\"ovhContactEdit[field].$dirty && ovhContactEdit[field].$touched\" role=alert class=col-xs-12><label for=\"{{ field }}\" data-ng-message=required data-translate=ovh_contact_edit_mandatory_field></label><label for=\"{{ field }}\" data-ng-message=pattern data-translate=\"{{ 'ovh_contact_edit_invalid_' + field }}\"></label></div></div></div><div class=form-group data-ng-switch-default=\"\"><label for={{field}} class=col-xs-12>{{ ($ctrl.getFieldTranslationKey(field) | translate) + ($ctrl.creationRules[field].canBeNull ? '' : ' *') }}</label><div class=\"col-xs-12 col-md-6\"><select class=form-control name={{field}} id={{field}} data-ng-options=\"item.value as item.label for item in $ctrl.creationRules[field].values | orderBy:'label'\" data-ng-model=$ctrl.ovhContactCtrl.contact[field] data-ng-required=!$ctrl.creationRules.country.canBeNull></select></div></div></div></div></div></fieldset><div class=\"footer-actions row\"><div class=\"col-xs-12 col-md-6\"><button type=submit class=\"btn btn-primary\" data-translate=\"{{ $ctrl.ovhContactCtrl.contact.id ? 'ovh_contact_edit_action_edit' : 'ovh_contact_edit_action_create' }}\" data-ng-disabled=\"ovhContactEdit.$invalid || !$ctrl.ovhContactCtrl.contact.hasChange()\"></button> <button type=button class=\"btn btn-default\" data-translate=ovh_contact_edit_action_cancel data-ng-click=$ctrl.cancelEdition()></button></div></div></form>"
  );


  $templateCache.put('ovh-angular-contact.html',
    "<div class=ovh-contact><!-- TRANSCLUDE CUSTOM LOADER WHEN INIT --><div data-ng-show=\"$ctrl.loading.load || $ctrl.loading.init\" data-ng-transclude></div><!-- TRANSCLUDE CUSTOM LOADER WHEN INIT --><div data-ng-show=\"!$ctrl.loading.load && !$ctrl.loading.init\"><ovh-contact-choice data-ng-if=\"!$ctrl.onlyCreate && !$ctrl.contact.inEdition\" data-ovh-contact-choice-filter=$ctrl.choiceOptions.filter data-ovh-contact-choice-custom-list=$ctrl.choiceOptions.customList data-ovh-contact-choice-options=$ctrl.choiceOptions.options></ovh-contact-choice><ovh-contact-edit data-ng-if=\"$ctrl.onlyCreate || $ctrl.contact.inEdition\"></ovh-contact-edit></div></div>"
  );

}]);
