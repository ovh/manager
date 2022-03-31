import controller from './vouchers.controller';
import template from './vouchers.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    deals: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
  controller,
  template,
};
