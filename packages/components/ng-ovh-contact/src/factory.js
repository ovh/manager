import angular from 'angular';
import { find, get, set } from 'lodash-es';

import moment from 'moment';

export default /* @ngInject */ function(OvhApiMe, CONTACT_PROTOTYPE_PATH) {
  const getDatas = function getDatas(instance) {
    const datas = {};

    angular.forEach(CONTACT_PROTOTYPE_PATH, (path) => {
      if (path === 'birthDay') {
        datas.birthDay = angular.isDate(instance.birthDay)
          ? moment(instance.birthDay).format('YYYY-MM-DD')
          : undefined;
      } else {
        set(datas, path, get(instance, path));
      }
    });

    return datas;
  };

  function OvhContact(options = {}) {
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
      province: undefined,
    };
    this.gender = options.gender || 'male';
    this.language = options.language || 'fr_FR';
    this.organisationType = options.organisationType;
    this.legalForm = options.legalForm || 'individual';

    this.nationality = options.nationality || 'FR';
    this.nationalIdentificationNumber = options.nationalIdentificationNumber;
    this.companyNationalIdentificationNumber =
      options.companyNationalIdentificationNumber;
    this.birthCity = options.birthCity;
    this.birthZip = options.birthZip;
    this.birthCountry = options.birthCountry || 'FR';
    this.birthDay =
      options.birthDay && moment(new Date(options.birthDay)).isValid()
        ? new Date(options.birthDay)
        : undefined;

    // custom attributes
    this.inEdition = false;
    this.saveForEdition = null;
    this.emailConfirmation = options.email;

    // default value of address country
    if (this.address && !this.address.country) {
      this.address.country = 'FR';
    }
  }

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
  OvhContact.prototype.save = function save() {
    const self = this;

    return OvhApiMe.Contact()
      .v6()
      .save(
        {
          contactId: self.id,
        },
        getDatas(self),
      )
      .$promise.then(() => self);
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
  OvhContact.prototype.create = function create() {
    const self = this;

    return OvhApiMe.Contact()
      .v6()
      .create({}, getDatas(self))
      .$promise.then((contact) => {
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
   *  Start the edition of a contact.
   *  Create a copy of current options to allow you to revert when necessary.
   *
   *  @returns {OvhContact} The current instance of OvhContact.
   */
  OvhContact.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;
    self.saveForEdition = {};

    angular.forEach(CONTACT_PROTOTYPE_PATH, (objectPath) => {
      set(self.saveForEdition, objectPath, angular.copy(get(self, objectPath)));
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
   *  @param {Boolean=} cancel Flag telling if we have to reset saved options
   *  when startEdition has been called.
   *
   *  @returns {OvhContact} The current instance of OvhContact.
   */
  OvhContact.prototype.stopEdition = function stopEdition(cancel) {
    const self = this;

    self.inEdition = false;

    if (self.saveForEdition && cancel) {
      angular.forEach(CONTACT_PROTOTYPE_PATH, (objectPath) => {
        set(
          self,
          objectPath,
          angular.copy(get(self.saveForEdition, objectPath)),
        );
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
   *  @param {String=} path Path of the attributes of the contact to check.
   *  If not provided, this will check all attributes paths of the instance.
   *
   *  @returns {Boolean} True if an options has changed. False otherwise.
   */
  OvhContact.prototype.hasChange = function hasChange(path) {
    const self = this;

    if (!self.saveForEdition) {
      return false;
    }

    if (path) {
      return get(self, path) !== get(self.saveForEdition, path);
    }
    return !!find(CONTACT_PROTOTYPE_PATH, (objPath) => self.hasChange(objPath));
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return OvhContact;
}
