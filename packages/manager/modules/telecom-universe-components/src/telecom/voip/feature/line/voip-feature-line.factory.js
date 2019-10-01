import get from 'lodash/get';
import isNull from 'lodash/isNull';
import set from 'lodash/set';

/**
 *  @ngdoc object
 *  @name managerApp.object:TucVoipLineFeature
 *
 *  @description
 *  <p>Inherits from {@link managerApp.object:TucVoipFeature TucVoipFeature}.</p>
 *  <p>Factory that describes a line feature (line or fax)
 *    with shared attributes returned by the different APIs.</p>
 *
 *  @constructor
 *  @param {Object} options                 Shared options required
 *                                          for creating a new instance of TucVoipLineFeature.
 *  @param {Object} options.notifications   An object representing the notifications options
 *                                          of the line feature.
 */
export default /* @ngInject */ (TucVoipFeature) => {
  class TucVoipLineFeature extends TucVoipFeature {
    constructor(options = {}) {
      // set parent options
      super(options);

      // set TucVoipLineFeature options (from API)
      this.setOptions(options);
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipLineFeature#setOptions
     *  @propertyOf managerApp.object:TucVoipLineFeature
     *
     *  @description
     *  <p>Set the shared options between `telephony.Line` and `telephony.Fax` enums.</p>
     *
     *  @return {TucVoipLineFeature} The `TucVoipLineFeature` instance with options setted.
     */
    setOptions(featureOptions) {
      this.notifications = featureOptions.notifications;

      // if notifications logs is not setted. Set it to defaults
      if (isNull(get(this.notifications, 'logs'))) {
        set(this.notifications, 'logs', {
          email: null,
          frequency: 'Never',
          sendIfNull: false,
        });
      }

      return this;
    }
  }

  return TucVoipLineFeature;
};
