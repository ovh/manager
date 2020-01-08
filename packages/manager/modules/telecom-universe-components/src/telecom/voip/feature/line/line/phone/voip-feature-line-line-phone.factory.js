/**
 *  @ngdoc object
 *  @name managerApp.object:TucVoipLinePhone
 *
 *  @description
 *  <p>Factory that describes a phone of a service with sip or mgcp featureType
 *    with attributes returned by `/telephony/{billingAccount}/line/{serviceName}/phone` API.</p>
 *
 *  @constructor
 *  @param {Object} options Options required for creating a new instance of TucVoipLinePhone (see {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/line/%7BserviceName%7D/phone#GET `telephony.Phone` enum}
 *  for available options properties).
 *
 *  Note that `billingAccount` and `serviceName` options are mandatory.
 */
export default () => {
  const mandatoryOptions = ['billingAccount', 'serviceName'];

  class TucVoipLinePhone {
    constructor(options = {}) {
      // check for mandatory options
      mandatoryOptions.forEach((option) => {
        if (!options[option]) {
          throw new Error(
            `${option} option must be specified when creating a new TucVoipLinePhone`,
          );
        }
      });

      // populate object attributes
      // mandatory attribute
      this.billingAccount = options.billingAccount;
      this.serviceName = options.serviceName;

      // populate other object attributes
      this.setOptions(options);
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipLinePhone#setOptions
     *  @propertyOf managerApp.object:TucVoipLinePhone
     *
     *  @description
     *  Set the options from `telephony.Phone` enum. This is called by default by the constructor.
     *
     *  @param {Object} options Optional options for creating a new instance of TucVoipLinePhone.
     *
     *  @return {TucVoipLinePhone} The `TucVoipLinePhone` instance with options setted.
     */
    setOptions(phoneOptions) {
      this.protocol = phoneOptions.protocol;
      this.macAddress = phoneOptions.macAddress;
      this.maxline = phoneOptions.maxline;
      this.mgcpIpRestriction = phoneOptions.mgcpIpRestriction;
      this.description = phoneOptions.description;
      this.phoneConfiguration = phoneOptions.phoneConfiguration;
    }
  }

  return TucVoipLinePhone;
};
