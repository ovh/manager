import angular from 'angular';
import findIndex from 'lodash/findIndex';

/**
 *  @ngdoc object
 *  @name managerApp.object:TucVoipBillingAccount
 *
 *  @description
 *  <p>Factory that describes a billingAccount with attributes
 *    returned by `/telephony/{billingAccount}` API.</p>
 *  <p>See {@link https://api.ovh.com/console/#/telephony/%7BbillingAccount%7D#GET `telephony.BillingAccount` enum} for available properties.</p>
 *  <p>Others "custom properties" are listed in **Properties** section bellow.</p>
 *
 *  @constructor
 *  @param {Object} options Options required for creating a new instance of TucVoipBillingAccount (see {@link https://api.ovh.com/console/#/telephony/%7BbillingAccount%7D#GET `telephony.BillingAccount` enum}
 *  for availables options properties).
 *
 *  Note that `billingAccount` option is mandatory.
 */
export default /* @ngInject */ (TucVoipService, tucVoipService) => {
  const mandatoryOptions = ['billingAccount'];

  class TucVoipBillingAccount {
    constructor(options = {}) {
      // check for mandatory options
      mandatoryOptions.forEach((option) => {
        if (!options[option]) {
          throw new Error(
            `${option} option must be specified when creating a new TucVoipBillingAccount`,
          );
        }
      });

      // populate object attributes
      // mandatory attribute
      this.billingAccount = options.billingAccount;
      this.uid = Math.random()
        .toString(36)
        .slice(2);

      // populate error (if some)
      this.error = options.error;

      // populate other attributes
      this.description = options.description;
      this.status = options.status;
      this.overrideDisplayedNumber = options.overrideDisplayedNumber;
      this.trusted = options.trusted;
      this.hiddenExternalNumber = options.hiddenExternalNumber;
      this.securityDeposit = options.securityDeposit;
      this.currentOutplan = options.currentOutplan;
      this.allowedOutplan = options.allowedOutplan;
      this.creditThreshold = options.creditThreshold;

      // custom attributes (not from API)
      /**
       *  @ngdoc property
       *  @name managerApp.object:TucVoipBillingAccount#services
       *  @propertyOf managerApp.object:TucVoipBillingAccount
       *
       *  @description
       *  <p>Store the services attached to the TucVoipBillingAccount instance.</p>
       *  <p>You can populate this services list with `addService` method
       *    or with `addServices` method.</p>
       *
       *  @return {Array.<TucVoipService>} An array of `TucVoipService` instances.
       */
      this.services = [];
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipBillingAccount#toString
     *  @methodOf managerApp.object:TucVoipBillingAccount
     *  @return {String}
     */
    toString() {
      return `${this.billingAccount}-${this.uid}`;
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipBillingAccount#getDisplayedName
     *  @methodOf managerApp.object:TucVoipBillingAccount
     *
     *  @description
     *  Get the displayed name of the billing account.
     *
     *  @return {String} The displayedName of the billingAccount
     *                   (the description if provided, the billingAccount value otherwise).
     */
    getDisplayedName() {
      return this.description || this.billingAccount;
    }

    /* ======================================
    =            Service section            =
    ======================================= */

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipBillingAccount#addService
     *  @methodOf managerApp.object:TucVoipBillingAccount
     *
     *  @description
     *  Add a service to billing account services list.
     *  If service already exists in list (meaning that a service with `serviceName`
     *  option is already in the list), the existing service will be replaced by a service with
     *  the new options passed in arguments.
     *
     *  @param {Object|TucVoipService} service
     *  The options for creating a new TucVoipService instance or a TucVoipService object.
     *
     *  @return {TucVoipService} The TucVoipService instance added (or replaced)
     *  to the services list.
     */
    addService(service) {
      const addedService =
        service.constructor.name !== 'TucVoipService'
          ? service
          : new TucVoipService(service);

      // check if service is already added
      const serviceIndex = findIndex(this.services, {
        serviceName: addedService.serviceName,
      });

      if (serviceIndex !== -1) {
        // if service exists - replace it
        this.services.splice(serviceIndex, 1, addedService);
      } else {
        // if service not exists - add it to the list
        this.services.push(addedService);
      }

      return addedService;
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipBillingAccount#addServices
     *  @methodOf managerApp.object:TucVoipBillingAccount
     *
     *  @description
     *  Add one or many services to the billing account services list.
     *
     *  @param {Array.<Object>|Object} services     An object or a list of objects with options
     *                                              for adding TucVoipService instances to billing
     *                                              account services list.
     *
     *  @return {Array.<VoipSercice>} The list of all the services of the billing account
     *                                (including added services).
     */
    addServices(services) {
      if (!angular.isArray(services)) {
        this.addService(services);
      } else {
        services.forEach((service) => {
          this.addService(service);
        });
      }

      return this.services;
    }

    /* -----  End of Service section  ------ */

    /* ==============================
    =            Filters            =
    =============================== */

    /* ----------  By service type  ---------- */

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipBillingAccount#getAlias
     *  @methodOf managerApp.object:TucVoipBillingAccount
     *
     *  @description
     *  Get the services of the billingAccount that match `alias` serviceType.
     *
     *  @return {Array.<VoipSercice>} The list of all services with serviceType alias
     *                                of the billing account.
     */
    getAlias() {
      return tucVoipService.constructor.filterAliasServices(this.services);
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipBillingAccount#getLines
     *  @methodOf managerApp.object:TucVoipBillingAccount
     *
     *  @description
     *  Get the services of the billingAccount that match line serviceType.
     *
     *  @return {Array.<VoipSercice>} The list of all services with serviceType line
     *                                of the billing account.
     */
    getLines() {
      return tucVoipService.constructor.filterLineServices(this.services);
    }

    /* ----------  By feature type  ---------- */

    /* -----  End of Filters  ------ */
  }

  return TucVoipBillingAccount;
};
