import head from 'lodash/head';
import intersection from 'lodash/intersection';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

/**
 *  Need to have client/app/telecom/telephony/line translations files to be loaded
 *  for fullgetFullDescription method.
 *  This should be the case when a state like telecom.telephony.billingAccount.line.dashboard.* is loaded.
 */
angular
  .module('managerApp')
  .factory('TelephonyGroupLineOffer', ($translate) => {
    const availableOfferTypes = ['priceplan', 'individual', 'trunk'];

    /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

    function TelephonyGroupLineOffer(offerOptionsParam) {
      let offerOptions = offerOptionsParam;

      if (!offerOptions) {
        offerOptions = {};
      }

      // FROM API
      this.name = offerOptions.name;
      this.price = offerOptions.price;
      this.description = offerOptions.description;

      // CUSTOM ATTRIBUTES
      this.details = offerOptions.details;
      this.type = this.getType();
    }

    /* -----  End of CONSTRUCTOR  ------*/

    /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

    TelephonyGroupLineOffer.prototype.getType = function getType() {
      const self = this;
      let intersect;

      if (!isEmpty(self.name)) {
        return head(self.name.split('.'));
      }
      if (isEmpty(self.name) && self.details && isArray(self.details)) {
        intersect = intersection(
          self.details[0].split('.'),
          availableOfferTypes,
        );
        return intersect.length ? intersect[0] : undefined;
      }
      return undefined;
    };

    TelephonyGroupLineOffer.prototype.getFullDescription = function getFullDescription() {
      const self = this;

      return self.type && self.type !== 'trunk'
        ? [
            $translate.instant(`telephony_line_offer_type_${self.type}`),
            self.description,
          ].join(' - ')
        : self.description;
    };

    /* -----  End of PROTOTYPE METHODS  ------*/

    return TelephonyGroupLineOffer;
  });
