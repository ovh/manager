import controller from './iplb-frontends.controller';
import template from './iplb-frontends.html';

export default {
  bindings: {
    goBack: '<',
    goToIplbFrontendDelete: '<',
    goToIplbFrontendPreview: '<',
    goToIplbFrontendUpdate: '<',
    serviceName: '<',
  },
  controller,
  template,
};
