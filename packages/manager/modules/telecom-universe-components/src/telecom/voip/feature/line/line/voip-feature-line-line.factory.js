/**
 *  @ngdoc object
 *  @name managerApp.object:TucVoipLine
 *
 *  @description
 *  <p>Inherits from {@link managerApp.object:TucVoipLineFeature TucVoipLineFeature}.</p>
 *  <p>Factory that describes a line feature with attributes
 *    returned by `/telephony/{billingAccount}/line/{serviceName}` API.</p>
 *
 *  @constructor
 *  @param {Object} options Options required for creating a new instance of TucVoipLine (see
 *                  {@link managerApp.object:TucVoipLineFeature `TucVoipLineFeature` constructor}
 *                          for availables inherited options properties and
 *  {@link https://eu.api.ovh.com/console/#/telephony/%7BbillingAccount%7D/line/%7BserviceName%7D#GET `telephony.Line` enum} for specific line options properties).
 */
export default /* @ngInject */ (TucVoipLineFeature) => {
  class TucVoipLine extends TucVoipLineFeature {
    constructor(options = {}) {
      // set parent options
      super(options);

      // set TucVoipLine options
      this.setOptions(options);
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipLine#setOptions
     *  @propertyOf managerApp.object:TucVoipLine
     *
     *  @description
     *  Set the options from `telephony.Line` enum. This is called by default by the constructor.
     *
     *  @return {TucVoipLine} The `TucVoipLine` instance with options setted.
     */
    setOptions(featureOptions) {
      super.setOptions(featureOptions);

      this.infrastructure = featureOptions.infrastructure;
      this.isAttachedToOtherLinesPhone =
        featureOptions.isAttachedToOtherLinesPhone;
      this.simultaneousLines = featureOptions.simultaneousLines;
    }
  }

  return TucVoipLine;
};
