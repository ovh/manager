import controller from './cdn-change-offer.controller';
import template from './cdn-change-offer.html';

export default {
  controller,
  template,
  bindings: {
    model: '<',
    trackClick: '<',
    goBack: '<',
    goToCdnChangeOffer: '<',
  },
};
