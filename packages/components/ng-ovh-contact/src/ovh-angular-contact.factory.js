/**
 *  @ngdoc object
 *  @name ovhContact.object:OvhContact
 *
 *  @requires User
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

angular.module("ovh-angular-contact").factory("OvhContact", function (User, CONTACT_PROTOTYPE_PATH) {
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

        return User.Contact().Lexi().save({
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

        return User.Contact().Lexi().create({}, getDatas(self)).$promise.then(function (contact) {
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

});
