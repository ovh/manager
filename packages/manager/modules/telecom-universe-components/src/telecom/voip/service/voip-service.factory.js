/**
 *  @ngdoc object
 *  @name managerApp.object:TucVoipService
 *
 *  @description
 *  <p>Factory that describes a service with attributes
 *    returned by `/telephony/{billingAccount}/service/{serviceName}` API.</p>
 *  <p>See {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/service/%7BserviceName%7D#GET `telephony.TelephonyService` enum} for available properties.</p>
 *
 *  @constructor
 *  @param {Object} options Options required for creating a new instance of TucVoipService (see {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/service/%7BserviceName%7D#GET `telephony.TelephonyService` enum}
 *  for availables options properties).
 *
 *  Note that `billingAccount` and `serviceName` options are mandatory.
 */
export default () => {
  const mandatoryOptions = ['billingAccount', 'serviceName'];

  class TucVoipService {
    constructor(options = {}) {
      // check for mandatory options
      mandatoryOptions.forEach((option) => {
        if (!options[option]) {
          throw new Error(
            `${option} option must be specified when creating a new TucVoipService`,
          );
        }
      });

      // populate object attributes
      // mandatory attribute
      this.billingAccount = options.billingAccount;
      this.serviceName = options.serviceName;

      // populate error (if some)
      this.error = options.error;

      // populate other attributes
      this.country = options.country;
      this.featureType = options.featureType;
      this.hasFaxCapabilities = options.hasFaxCapabilities;
      this.rio = options.rio;
      this.currentOutplan = options.currentOutplan;
      this.description = options.description;
      this.properties = options.properties;
      this.countryCode = options.countryCode;
      this.serviceType = options.serviceType;
      this.getPublicOffer = options.getPublicOffer;
      this.offers = options.offers;
      this.simultaneousLines = options.simultaneousLines;
      this.associatedDeviceMac = options.associatedDeviceMac;
    }

    /* ===================================
        =            Some Helpers            =
        ==================================== */

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipService#getDisplayedName
     *  @propertyOf managerApp.object:TucVoipService
     *
     *  @description
     *  Get the displayed name of the service.
     *
     *  @return {String} The displayedName of the service (the description if provided,
     *                   the serviceName value otherwise).
     */
    getDisplayedName() {
      return this.description || this.serviceName;
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipService#getFullDisplayedName
     *  @propertyOf managerApp.object:TucVoipService
     *
     *  @description
     *  Get the full displayed name of the service.
     *
     *  @return {String} The full displayed name of the service (the service name plus
     *                   the description if provided. e.g. "0033712345678 (some description)").
     */
    getFullDisplayedName() {
      const { description = '', serviceName = '' } = this;
      const formattedDescription =
        description && !this.isDescriptionSameAsServiceName()
          ? ` (${description})`
          : '';
      return serviceName + formattedDescription;
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipService#isDescriptionSameAsServiceName
     *  @propertyOf managerApp.object:TucVoipService
     *
     *  @description
     *  Helper that check if the description is the same as serviceName.
     *
     *  @return {Boolean}   `true` if description is the same that serviceName.
     */
    isDescriptionSameAsServiceName() {
      return this.description === this.serviceName;
    }

    /**
     * @description
     * Helper that check if service public offer is valid
     *
     * @return {Boolean}
     */
    hasValidPublicOffer() {
      return (
        this.getPublicOffer.name !== '' &&
        this.getPublicOffer.description !== 'The Service has an error'
      );
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipService#getRawAssociatedDeviceMac
     *  @propertyOf managerApp.object:TucVoipService
     *
     *  @description
     *  Get the <i>associatedDeviceMac</i> of the service as lower cased raw value, i.e. without ":".
     *
     *  @return {String}
     */
    getRawAssociatedDeviceMac() {
      return this.associatedDeviceMac
        ? this.associatedDeviceMac.replace(/:/g, '').toLowerCase()
        : '';
    }

    /* -----  End of Some Helpers  ------ */
  }

  return TucVoipService;
};
