import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    backButtonText: '<',
    goBack: '<',
    productId: '<',
    range: '<',
    upgradeCode: '<',
  },
  controller,
  template,
};
