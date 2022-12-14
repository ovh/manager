import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    backButtonText: '<',
    goBack: '<',
    managementFeeServiceId: '<',
    productId: '<',
    range: '<',
    upgradeCode: '<',
    trackClick: '<',
  },
  controller,
  template,
};
