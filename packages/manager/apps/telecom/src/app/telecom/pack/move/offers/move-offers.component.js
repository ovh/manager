import controller from './move-offers.controller';
import template from './move-offers.html';

export default {
  controller,
  template,
  bindings: {
    eligibilityReference: '<',
    eligibilityReferenceFiber: '<',
    packName: '<',
    currentOffer: '<',
  },
};
