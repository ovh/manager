import get from 'lodash/get';
import some from 'lodash/some';

/**
 *  @ngdoc object
 *  @name managerApp.object:TucVoipServiceLine
 *
 *  @description
 *  <p>Inherits from {@link managerApp.object:TucVoipService TucVoipService}.</p>
 *  <p>This factory doesn't describe any API return. The API that describes
 *    the most this factory is `/telephony/{billingAccount}/service/{serviceName}`.</p>
 *
 *  @constructor
 *  @param {Object} options Options required for creating a new instance of TucVoipServiceLine
 *                  (see {@link managerApp.object:TucVoipService `TucVoipService` constructor}
 *                          for availables options properties).
 */
export default /* @ngInject */ (TucVoipService) => {
  class TucVoipServiceLine extends TucVoipService {
    constructor(options = {}) {
      super(options);
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipServiceLine#getRealFeatureType
     *  @propertyOf managerApp.object:TucVoipServiceLine
     *
     *  @description
     *  Get the real feature type of a service. Useful to get trunk lines.
     *
     *  @return {String} The real feature type of the service.
     */
    getRealFeatureType() {
      return this.isSipTrunk() ? 'trunk' : this.featureType;
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipServiceLine#isSipTrunk
     *  @propertyOf managerApp.object:TucVoipServiceLine
     *
     *  @description
     *  Helper that try to check if the service offer is trunk or not.
     *
     *  @return {Boolean}   `true` if the line service is a sip trunk.
     */
    isSipTrunk() {
      const publicOfferName = get(this.getPublicOffer, 'name');
      return publicOfferName === 'trunk' || get(publicOfferName.split('.'), '[0]') === 'trunk';
    }

    /**
     *  @ngdoc method
     *  @name managerApp.object:TucVoipServiceLine#isSipTrunkRates
     *  @propertyOf managerApp.object:TucVoipServiceLine
     *
     *  @description
     *  Helper that try to check if the service offer is trunk rates or not.
     *
     *  @return {Boolean}   `true` if the line service is a sip trunk rates.
     */
    isSipTrunkRates() {
      return some(this.offers, (offer) => offer === 'voip.main.offer.fr.trunk.rates');
    }
  }

  return TucVoipServiceLine;
};
