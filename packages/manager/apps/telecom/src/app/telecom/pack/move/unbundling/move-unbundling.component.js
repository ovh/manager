import controller from './move-unbundling.controller';
import template from './move-unbundling.html';

export default {
  controller,
  template,
  bindings: {
    offerName: '<',
    offersEligible: '<',
    address: '<',
    copperInfo: '<',
    prices: '<',
  },
};
