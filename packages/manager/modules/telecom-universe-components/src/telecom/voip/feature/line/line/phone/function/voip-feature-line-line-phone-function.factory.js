/**
 * @ngdoc  object
 * @name managerApp.object:TucVoipLinePhoneFunction
 *
 * @description
 * <p>Factory that describes a function key of a phone of a service with sip or mgcp feature type
 *   with attributes returned by
 *   `/telephony/{billingAccount}/line/{serviceName}/phone/functionKey/{keyNum}` API.</p>
 *
 * @constructor
 * @param {Object} options Options required for creating a new instance of TucVoipLinePhoneFunction
 * (see {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/line/%7BserviceName%7D/phone/functionKey/%7BkeyNum%7D#GET `telephony.Phone.FunctionKey` enum}
 * for available options properties).
 *
 * Note that `billingAccount` and `serviceName` options are mandatory.
 */
export default () => {
  const mandatoryOptions = ['billingAccount', 'serviceName'];

  class TucVoipLinePhoneFunction {
    constructor(options = {}) {
      // check for mandatory options
      mandatoryOptions.forEach((option) => {
        if (!options[option]) {
          throw new Error(
            `${option} option must be specified when creating a new TucVoipLinePhone`,
          );
        }
      });

      this.billingAccount = options.billingAccount;
      this.serviceName = options.serviceName;

      this.setOptions(options);
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipLinePhoneFunction#setOptions
     *  @propertyOf managerApp.object:TucVoipLinePhoneFunction
     *
     *  @description
     *  Set the options from `telephony.Phone.Function` enum.
     *  This is called by default by the constructor.
     *
     *  @param {Object} options Optional options for creating
     *                          a new instance of TucVoipLinePhoneFunction.
     *
     *  @return {TucVoipLinePhoneFunction} The `TucVoipLinePhoneFunction` instance
     *  with options setted.
     */
    setOptions(options) {
      this.parameter = options.parameter;
      this.function = options.function;
      this.label = options.label;
      this.default = options.default;
      this.type = options.type;
      this.keyNum = options.keyNum;
      this.availableFunctions = options.availableFunctions || [];
    }
  }

  return TucVoipLinePhoneFunction;
};
